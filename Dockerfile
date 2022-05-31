FROM node:alpine AS builder

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
RUN mkdir /app
COPY --from=builder /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf
