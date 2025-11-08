#!/bin/bash

echo "=========================================="
echo "修复 Next.js 应用监听问题"
echo "=========================================="

# 0. 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "错误: 请在项目根目录执行此脚本"
    exit 1
fi

# 1. 检查 .next 目录是否存在
echo "1. 检查构建文件..."
if [ ! -d ".next" ]; then
    echo "   未找到 .next 目录，需要先构建..."
    echo "   正在构建应用..."
    pnpm build || npm run build || {
        echo "   构建失败！请检查错误信息"
        exit 1
    }
    echo "   构建完成！"
else
    echo "   找到 .next 目录"
fi

# 2. 停止现有应用
echo ""
echo "2. 停止现有应用..."
pm2 stop findhouse 2>/dev/null || true
pm2 delete findhouse 2>/dev/null || true

# 3. 更新配置后启动
echo ""
echo "3. 使用更新后的配置启动应用..."
pm2 start ecosystem.config.js

# 4. 等待几秒让应用启动
echo "   等待应用启动..."
sleep 5

# 5. 检查状态
echo ""
echo "4. 应用状态:"
pm2 status

# 6. 检查端口监听
echo ""
echo "5. 端口监听情况:"
sudo netstat -tlnp | grep 3000 || sudo ss -tlnp | grep 3000 || echo "   端口 3000 未被监听（可能有错误）"

# 7. 测试访问
echo ""
echo "6. 测试应用响应:"
echo "   测试 http://localhost:3000:"
curl -s http://localhost:3000 | head -5 || echo "   访问失败"

# 8. 查看日志
echo ""
echo "7. 最近的应用日志:"
pm2 logs findhouse --lines 30 --nostream 2>/dev/null || echo "   无法获取日志"

echo ""
echo "=========================================="
echo "完成！如果还有问题，请查看日志:"
echo "pm2 logs findhouse"
echo "=========================================="

