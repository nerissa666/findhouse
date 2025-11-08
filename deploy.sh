#!/bin/bash

# Next.js 项目部署脚本
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

echo "=========================================="
echo "开始部署 findhouse 项目"
echo "=========================================="

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在项目目录
if [ ! -f "package.json" ]; then
    echo -e "${RED}错误: 请在项目根目录执行此脚本${NC}"
    exit 1
fi

# 1. 检查 Git 状态（如果有 Git）
if [ -d ".git" ]; then
    echo -e "${YELLOW}[1/6] 检查 Git 状态...${NC}"
    git status
    read -p "是否拉取最新代码? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git pull
    fi
else
    echo -e "${YELLOW}[1/6] 跳过 Git 检查（非 Git 仓库）${NC}"
fi

# 2. 安装依赖
echo -e "${YELLOW}[2/6] 安装依赖...${NC}"
pnpm install

# 3. 构建项目
echo -e "${YELLOW}[3/6] 构建项目...${NC}"
pnpm build

# 4. 检查构建结果
if [ ! -d ".next" ]; then
    echo -e "${RED}错误: 构建失败，.next 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}构建成功！${NC}"

# 5. 重启 PM2（如果已安装）
if command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}[4/6] 检查 PM2 状态...${NC}"
    
    if pm2 list | grep -q "findhouse"; then
        echo -e "${YELLOW}[5/6] 重启 PM2 应用...${NC}"
        pm2 restart findhouse
    else
        echo -e "${YELLOW}[5/6] 启动 PM2 应用...${NC}"
        pm2 start ecosystem.config.js || pm2 start "pnpm start" --name findhouse
    fi
    
    pm2 save
    
    echo -e "${YELLOW}[6/6] PM2 状态:${NC}"
    pm2 status
else
    echo -e "${YELLOW}[4-6/6] PM2 未安装，跳过自动重启${NC}"
    echo -e "${YELLOW}请手动启动: pnpm start 或 pm2 start ecosystem.config.js${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo -e "部署完成！"
echo -e "==========================================${NC}"
echo ""
echo "如果使用 PM2，可以执行以下命令："
echo "  - 查看日志: pm2 logs findhouse"
echo "  - 查看状态: pm2 status"
echo "  - 监控: pm2 monit"
echo ""

