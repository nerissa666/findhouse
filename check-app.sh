#!/bin/bash

echo "=========================================="
echo "检查 Next.js 应用状态"
echo "=========================================="

echo ""
echo "1. PM2 状态:"
pm2 status

echo ""
echo "2. 检查端口监听:"
echo "端口 3000 监听情况:"
sudo netstat -tlnp | grep 3000 || sudo ss -tlnp | grep 3000 || echo "端口 3000 未被监听"

echo ""
echo "3. PM2 日志（最近 50 行）:"
pm2 logs findhouse --lines 50 --nostream || pm2 logs --lines 50 --nostream

echo ""
echo "4. 测试应用响应:"
echo "测试 http://localhost:3000:"
curl -v http://localhost:3000 2>&1 | head -30

echo ""
echo "5. 测试 http://127.0.0.1:3000:"
curl -v http://127.0.0.1:3000 2>&1 | head -30

echo ""
echo "6. 检查进程:"
ps aux | grep -E "next|node.*3000" | grep -v grep

echo ""
echo "=========================================="
echo "检查完成"
echo "=========================================="












