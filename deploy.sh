#!/bin/bash

# Polymarket Hype Radar - Vercel 部署脚本

echo "🚀 开始部署到 Vercel..."
echo ""

# 检查是否已登录 Vercel
if ! vercel whoami &> /dev/null; then
    echo "📝 首次使用需要登录 Vercel"
    echo "请按照提示操作："
    echo "1. 选择登录方式（推荐使用 GitHub）"
    echo "2. 在浏览器中完成授权"
    echo ""
    vercel login
fi

echo ""
echo "🔧 开始部署项目..."
echo ""

# 部署到 Vercel
# --yes: 自动确认所有提示
# --prod: 直接部署到生产环境
vercel --prod --yes

echo ""
echo "✅ 部署完成！"
echo ""
echo "📝 请查看上方输出的 URL 访问你的网站"
echo ""
