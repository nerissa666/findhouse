# Next.js 子路径部署说明

## 问题说明

当 Next.js 应用部署在子路径下（如 `/findhouse`）时，需要同时配置 Next.js 和 Nginx。

## 已修复的配置

### 1. Next.js 配置 (`next.config.ts`)

已添加 `basePath` 配置：
```typescript
basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/findhouse",
```

### 2. Nginx 配置 (`nginx.conf`)

已修复 `location /findhouse` 配置：
- ✅ 添加了 `proxy_pass` 末尾的斜杠 `/`
- ✅ 添加了必要的 proxy headers
- ✅ 添加了 WebSocket 支持（如果需要）

## 部署步骤

### 1. 在服务器上重新构建

```bash
cd /var/www/findhouse

# 方式一：使用环境变量
NEXT_PUBLIC_BASE_PATH=/findhouse pnpm build

# 方式二：直接构建（会使用 next.config.ts 中的默认值）
pnpm build
```

### 2. 重启 Next.js 应用

```bash
pm2 restart findhouse
# 或
pm2 restart ecosystem.config.js
```

### 3. 更新 Nginx 配置并重载

```bash
# 如果修改了完整的 nginx.conf
sudo cp nginx.conf /etc/nginx/nginx.conf

# 或者只修改配置文件
sudo nano /etc/nginx/conf.d/findhouse.conf

# 测试配置
sudo nginx -t

# 重载 Nginx
sudo systemctl reload nginx
```

## 验证

1. 检查 Next.js 应用是否运行：
```bash
curl http://localhost:3000/findhouse
```

2. 检查 Nginx 配置：
```bash
sudo nginx -t
```

3. 查看错误日志：
```bash
# Nginx 错误日志
sudo tail -f /var/log/nginx/error.log

# PM2 日志
pm2 logs findhouse
```

## 常见问题

### 问题 1: 404 错误

**原因**：Next.js 没有配置 `basePath` 或构建时没有使用正确的 basePath

**解决**：
```bash
# 重新构建
NEXT_PUBLIC_BASE_PATH=/findhouse pnpm build
pm2 restart findhouse
```

### 问题 2: 静态资源 404

**原因**：静态资源路径不正确

**解决**：确保 Next.js 已正确配置 `basePath`，并且重新构建

### 问题 3: 路径重定向错误

**原因**：Next.js 内部路由重定向没有考虑 basePath

**解决**：检查代码中是否使用了绝对路径，应使用相对路径或 `next/link` 组件

## 重要提示

1. **必须重新构建**：修改 `basePath` 后必须重新运行 `pnpm build`
2. **环境变量优先**：如果设置了 `NEXT_PUBLIC_BASE_PATH` 环境变量，它会覆盖 `next.config.ts` 中的配置
3. **所有路径都需要前缀**：部署在子路径下时，所有访问路径都需要包含 `/findhouse` 前缀

## 测试命令

```bash
# 在服务器上测试
curl http://localhost:3000/findhouse

# 从外部测试
curl https://124.71.203.87/findhouse
```












