# 快速部署指南

## 服务器端操作（CentOS）

### 1. 准备环境

```bash
# 安装 Node.js 和 pnpm
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs
npm install -g pnpm pm2

# 安装 Nginx
sudo yum install -y epel-release nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. 部署项目

```bash
# 上传项目到服务器（或使用 Git clone）
cd /var/www
# git clone <your-repo> findhouse
cd findhouse

# 安装依赖并构建
pnpm install
pnpm build

# 使用 PM2 启动
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd  # 按提示执行命令
```

### 3. 配置 Nginx

编辑 `/etc/nginx/conf.d/findhouse.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

```

然后执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 4. 配置防火墙

```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 使用部署脚本（推荐）

```bash
# 在服务器上执行
./deploy.sh
```

## 后续更新

```bash
cd /var/www/findhouse
git pull
./deploy.sh
```

## 常用命令

```bash
# PM2 管理
pm2 status
pm2 logs findhouse
pm2 restart findhouse
pm2 monit

# Nginx 管理
sudo systemctl status nginx
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

## 查看应用

访问：`http://your-server-ip` 或 `http://your-domain.com`
