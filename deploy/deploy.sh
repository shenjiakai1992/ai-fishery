#!/bin/bash
# deploy/deploy.sh — 生产部署脚本（在服务器上执行）
set -e

APP_DIR="/var/www/ai-fishery"

echo "📦 拉取最新代码..."
cd $APP_DIR
git pull origin main

echo "📦 安装依赖..."
pnpm install --frozen-lockfile

echo "🗄️  执行数据库迁移..."
pnpm prisma migrate deploy

echo "🌱 播种种子数据（幂等）..."
pnpm db:seed

echo "🏗️  构建..."
pnpm build

echo "🔄 重启 PM2 进程..."
pm2 reload ai-fishery || pm2 start deploy/ecosystem.config.js

echo "✅ 部署完成！"
