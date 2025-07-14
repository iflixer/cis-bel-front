FROM node:14 AS builder

RUN sed -i 's|http://deb.debian.org/debian|http://archive.debian.org/debian|g' /etc/apt/sources.list && \
    sed -i 's|http://security.debian.org|http://archive.debian.org/debian-security|g' /etc/apt/sources.list && \
    echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until && \
    apt-get update && \
    apt-get install -y python2 make g++ && \
    ln -sf python2 /usr/bin/python && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

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

# Production image with nginx
FROM nginx:stable AS production

COPY nginx/default.conf.template /etc/nginx/templates/
COPY --from=builder /app/kholobok.biz /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

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
RUN npm ci
COPY . .

EXPOSE 8040

CMD ["npm", "run", "dev_src"]
