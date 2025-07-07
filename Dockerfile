FROM node:14 AS builder

RUN apt-get update && apt-get install -y \
    python2 \
    make \
    g++ \
    && ln -sf python2 /usr/bin/python \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHON=/usr/bin/python2

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx rimraf kholobok.biz && \
    npx webpack --mode production && \
    ls -la kholobok.biz/

# Production image with nginx
FROM nginx:stable AS production

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/kholobok.biz /usr/share/nginx/html

EXPOSE 80

CMD ["sh", "-c", "echo 'Starting nginx...' && echo 'Files in html:' && ls -la /usr/share/nginx/html/ && nginx -t && nginx -g 'daemon off;'"]

# Development image
FROM node:14 AS development

RUN apt-get update && apt-get install -y \
    python2 \
    make \
    g++ \
    && ln -sf python2 /usr/bin/python \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ENV PYTHON=/usr/bin/python2
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8040

CMD ["npm", "run", "dev_src"]
