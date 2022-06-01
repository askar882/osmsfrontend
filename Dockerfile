FROM node:alpine AS builder

LABEL author=askar882

# 设置环境变量
ENV NODE_OPTIONS=--openssl-legacy-provider

# 配置镜像
RUN npm config set -g registry=https://registry.npmmirror.com

# 安装依赖
WORKDIR /app
COPY package.json ./
RUN npm install

# 构建
COPY ./ .
RUN npm run build


# 部署
FROM nginx:stable-alpine AS production

LABEL author=askar882

RUN mkdir /app
COPY --from=builder /app/dist /app

RUN mkdir /etc/nginx/templates
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
