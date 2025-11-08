# Next.js 项目部署到 CentOS 服务器指南

## 一、服务器环境准备

### 1. 安装 Node.js 和 pnpm

```bash
# 更新系统
sudo yum update -y

# 安装 Node.js (使用 NodeSource 仓库)
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# 验证安装
node --version
npm --version

# 安装 pnpm
npm install -g pnpm

# 验证 pnpm
pnpm --version
```

### 2. 安装 PM2 (进程管理器)

```bash
sudo npm install -g pm2

# 设置 PM2 开机自启
pm2 startup systemd
# 按照输出的命令执行（通常需要 sudo）
```

### 3. 安装 Nginx (反向代理)

```bash
# 安装 EPEL 仓库
sudo yum install -y epel-release

# 安装 Nginx
sudo yum install -y nginx

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 检查状态
sudo systemctl status nginx
```

## 二、项目部署

### 1. 上传代码到服务器

**方式一：使用 Git (推荐)**

```bash
# 在服务器上克隆项目
cd /var/www  # 或你选择的目录
git clone <your-repo-url> findhouse
cd findhouse
```

**方式二：使用 SCP**

```bash
# 在本地执行
scp -r /Users/xgx/Desktop/project/findhouse root@your-server-ip:/var/www/

# 或者在服务器上创建目录后使用 rsync
rsync -avz --exclude 'node_modules' --exclude '.next' \
  /Users/xgx/Desktop/project/findhouse/ \
  root@your-server-ip:/var/www/findhouse/
```

### 2. 在服务器上安装依赖和构建

```bash
# 进入项目目录
cd /var/www/findhouse

# 安装依赖
pnpm install

# 构建项目
pnpm build

# 验证构建
ls -la .next
```

### 3. 配置环境变量

```bash
# 创建 .env.production 文件
nano .env.production
```

添加必要的环境变量：
```
# 示例
NEXT_PUBLIC_API_URL=http://your-api-server
DATABASE_URL=your-database-url
# ... 其他环境变量
```

## 三、使用 PM2 启动应用

### 1. 创建 PM2 配置文件

在项目根目录创建 `ecosystem.config.js`:

```bash
nano ecosystem.config.js
```

内容：
```javascript
module.exports = {
  apps: [
    {
      name: 'findhouse',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/findhouse',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: '/var/log/pm2/findhouse-error.log',
      out_file: '/var/log/pm2/findhouse-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '1G',
    },
  ],
};
```

### 2. 启动应用

```bash
# 使用配置文件启动
pm2 start ecosystem.config.js

# 或者直接启动
pm2 start "pnpm start" --name findhouse

# 查看状态
pm2 status

# 查看日志
pm2 logs findhouse

# 保存 PM2 配置
pm2 save
```

### 3. PM2 常用命令

```bash
# 重启应用
pm2 restart findhouse

# 停止应用
pm2 stop findhouse

# 删除应用
pm2 delete findhouse

# 查看实时日志
pm2 logs findhouse --lines 50

# 监控
pm2 monit
```

## 四、配置 Nginx 反向代理

### 1. 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/conf.d/findhouse.conf
```

内容：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或服务器IP

    # 静态文件缓存
    location /_next/static {
        alias /var/www/findhouse/.next/static;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # 其他请求代理到 Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 2. 测试并重载 Nginx

```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx
```

## 五、配置防火墙

```bash
# 如果使用 firewalld
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 如果使用 iptables
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo service iptables save
```

## 六、配置 HTTPS (使用 Let's Encrypt)

```bash
# 安装 Certbot
sudo yum install -y certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期测试
sudo certbot renew --dry-run
```

## 七、设置开机自启

### 1. PM2 已配置开机自启（之前已执行）

### 2. 确保 Nginx 开机自启

```bash
sudo systemctl enable nginx
```

## 八、部署脚本 (可选)

创建部署脚本 `deploy.sh`:

```bash
#!/bin/bash
set -e

echo "开始部署..."

# 拉取最新代码
git pull origin main

# 安装依赖
pnpm install

# 构建
pnpm build

# 重启应用
pm2 restart findhouse

echo "部署完成！"
```

赋予执行权限：
```bash
chmod +x deploy.sh
```

## 九、监控和维护

### 1. 查看应用状态

```bash
# PM2 状态
pm2 status

# Nginx 状态
sudo systemctl status nginx

# 查看端口占用
sudo netstat -tlnp | grep :3000
```

### 2. 日志查看

```bash
# PM2 日志
pm2 logs findhouse

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 3. 性能监控

```bash
# PM2 监控
pm2 monit

# 系统资源
top
htop
```

## 十、常见问题排查

### 1. 端口被占用

```bash
# 查看端口占用
sudo lsof -i :3000

# 杀死进程
sudo kill -9 <PID>
```

### 2. 权限问题

```bash
# 确保目录权限
sudo chown -R $USER:$USER /var/www/findhouse

# 确保 .next 目录可读
chmod -R 755 /var/www/findhouse/.next
```

### 3. 内存不足

```bash
# 检查内存
free -h

# 如果内存不足，可以：
# 1. 增加服务器内存
# 2. 限制 PM2 实例数
# 3. 优化 Next.js 构建配置
```

## 十一、优化建议

### 1. 生产环境优化

- 确保 `NODE_ENV=production`
- 使用 `.env.production` 文件
- 启用 Next.js 压缩
- 配置 CDN 加速静态资源

### 2. 安全建议

- 定期更新系统和依赖
- 配置防火墙规则
- 使用 HTTPS
- 定期备份数据库和代码
- 配置日志轮转

### 3. 性能优化

- 使用 Next.js Image 优化图片
- 启用静态页面生成
- 配置适当的缓存策略
- 使用 CDN 分发静态资源

## 十二、快速部署命令总结

```bash
# 1. 在服务器上克隆/上传项目
cd /var/www
git clone <repo> findhouse
cd findhouse

# 2. 安装依赖并构建
pnpm install
pnpm build

# 3. 使用 PM2 启动
pm2 start ecosystem.config.js
pm2 save

# 4. 配置 Nginx
sudo nano /etc/nginx/conf.d/findhouse.conf
sudo nginx -t
sudo systemctl reload nginx

# 5. 完成！
```

---

**注意事项：**
- 确保服务器有足够的资源（内存、CPU）
- 定期备份重要数据
- 监控应用运行状态
- 及时更新依赖包以修复安全漏洞






