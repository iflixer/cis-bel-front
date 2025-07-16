FROM node:14-bullseye AS builder

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
RUN npm ci --include=dev

COPY . .

RUN npx rimraf kholobok.biz && \
    npx webpack --mode production && \
    ls -la kholobok.biz/

COPY ./dop kholobok.biz/dop

# Production image with nginx
FROM nginx:stable AS production

COPY nginx/default.conf.template /etc/nginx/templates/
COPY --from=builder /app/kholobok.biz /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Development image
FROM node:14-bullseye AS development

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
RUN npm ci
COPY . .

EXPOSE 8040

CMD ["npm", "run", "dev_src"]
