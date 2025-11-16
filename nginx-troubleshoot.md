# Nginx 301 重定向问题排查

## 问题分析

`301 Moved Permanently` 是正常的，因为你的配置中 HTTP (80端口) 会自动重定向到 HTTPS。

## 排查步骤

### 1. 测试 HTTPS 访问（跳过 HTTP 重定向）

```bash
# 跳过 SSL 证书验证测试（仅用于调试）
curl -k https://localhost/findhouse

# 或者使用 IP 地址
curl -k https://124.71.203.87/findhouse
```

### 2. 检查 Next.js 应用是否运行

```bash
# 检查 PM2 状态
pm2 status

# 检查端口是否被占用
sudo netstat -tlnp | grep 3000
# 或
sudo ss -tlnp | grep 3000

# 直接测试 Next.js 应用
curl http://localhost:3000
```

### 3. 检查 Nginx 配置和日志

```bash
# 测试 Nginx 配置语法
sudo nginx -t

# 查看错误日志
sudo tail -50 /var/log/nginx/error.log

# 查看访问日志
sudo tail -50 /var/log/nginx/access.log
```

### 4. 验证 Nginx 配置是否正确加载

```bash
# 检查配置文件
sudo nginx -T | grep -A 20 "location /findhouse"

# 确保配置已重载
sudo nginx -s reload
```

## 常见问题和解决方案

### 问题 1: Next.js 应用未启动

```bash
# 启动应用
pm2 start ecosystem.config.js
# 或
pm2 restart findhouse
```

### 问题 2: 端口冲突

```bash
# 检查 3000 端口
sudo lsof -i :3000

# 如果被占用，杀死进程或修改端口
```

### 问题 3: 权限问题

```bash
# 检查 SELinux（如果启用）
sudo getenforce

# 如果是 Enforcing，可能需要临时禁用或配置 SELinux
sudo setenforce 0  # 临时禁用（仅用于测试）
```

### 问题 4: 防火墙问题

```bash
# 检查防火墙规则
sudo firewall-cmd --list-all

# 确保允许 443 端口
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## 完整的测试流程

```bash
# 1. 确保 Next.js 运行
pm2 status
curl http://localhost:3000

# 2. 检查 Nginx 配置
sudo nginx -t

# 3. 测试 HTTP（应该返回 301）
curl -I http://localhost/findhouse

# 4. 测试 HTTPS
curl -k https://localhost/findhouse

# 5. 查看日志
sudo tail -f /var/log/nginx/error.log
```

## 如果 HTTPS 访问也失败

检查以下几点：

1. **SSL 证书是否有效**
```bash
sudo openssl x509 -in /etc/nginx/nerissa666.xyz_nginxs/nerissa666.xyz.pem -text -noout
```

2. **Next.js 应用是否正常响应**
```bash
# 在服务器上直接测试
curl http://localhost:3000
```

3. **检查 rewrite 规则是否正确**
```bash
# 查看完整的 location 配置
sudo nginx -T | grep -A 15 "location /findhouse"
```












