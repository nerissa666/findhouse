# MySQL 安装后配置指南

## ✅ 安装已完成！

MySQL 8.0.44 已成功安装，现在需要进行初始配置。

## 步骤 1: 启动 MySQL 服务

```bash
# 启动 MySQL 服务
sudo systemctl start mysqld

# 设置开机自启
sudo systemctl enable mysqld

# 查看服务状态
sudo systemctl status mysqld
```

## 步骤 2: 获取临时密码

MySQL 安装后会为 root 用户生成一个临时密码，需要先查看：

```bash
# 查看临时密码（在日志文件的最后几行）
sudo grep 'temporary password' /var/log/mysqld.log

# 或者查看完整的密码行
sudo grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}'
```

**示例输出：**
```
2025-11-01T15:30:45.234567Z 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: YourTempPassword123!
```

临时密码就是最后的 `YourTempPassword123!` 部分。

## 步骤 3: 登录 MySQL

使用临时密码登录：

```bash
mysql -uroot -p
```

输入刚才获取的临时密码（输入时不会显示字符，这是正常的）。

## 步骤 4: 修改 root 密码

登录成功后，立即修改密码：

```sql
-- 修改 root 密码（密码需要包含大小写字母、数字和特殊字符，至少 8 位）
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourNewPassword123!';

-- 刷新权限
FLUSH PRIVILEGES;

-- 退出
EXIT;
```

**密码要求：**
- 至少 8 个字符
- 包含大写字母
- 包含小写字母
- 包含数字
- 包含特殊字符

## 步骤 5: 使用新密码重新登录验证

```bash
mysql -uroot -p
# 输入新密码
```

如果成功登录，说明密码修改成功！

## 步骤 6: 基本配置（可选）

### 6.1 创建新数据库

```sql
CREATE DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 6.2 创建新用户（推荐，不要直接用 root）

```sql
-- 创建用户
CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'YourPassword123!';

-- 授予权限（授予所有权限）
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_user'@'localhost';

-- 或者授予所有数据库的所有权限
GRANT ALL PRIVILEGES ON *.* TO 'your_user'@'localhost';

-- 刷新权限
FLUSH PRIVILEGES;
```

### 6.3 允许远程连接（如果需要）

```sql
-- 创建允许远程连接的用户
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'RemotePassword123!';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%';
FLUSH PRIVILEGES;
```

**注意：** 允许远程连接需要配置防火墙：

```bash
# CentOS 7/8/9
sudo firewall-cmd --permanent --add-service=mysql
sudo firewall-cmd --reload

# 或者开放 3306 端口
sudo firewall-cmd --permanent --add-port=3306/tcp
sudo firewall-cmd --reload
```

### 6.4 运行安全配置向导（推荐）

```bash
sudo mysql_secure_installation
```

这会引导你：
- ✅ 设置密码验证策略
- ✅ 删除匿名用户
- ✅ 禁止 root 远程登录（可选）
- ✅ 删除测试数据库
- ✅ 重新加载权限表

## 步骤 7: 查看 MySQL 信息

```sql
-- 查看版本
SELECT VERSION();

-- 查看当前用户
SELECT USER();

-- 查看所有数据库
SHOW DATABASES;

-- 查看所有用户
SELECT user, host FROM mysql.user;
```

## 常用命令速查

```bash
# 服务管理
sudo systemctl start mysqld      # 启动
sudo systemctl stop mysqld       # 停止
sudo systemctl restart mysqld    # 重启
sudo systemctl status mysqld     # 查看状态

# 登录 MySQL
mysql -uroot -p                  # 使用 root 登录
mysql -uyour_user -p             # 使用指定用户登录
mysql -h hostname -uuser -p      # 远程连接

# 查看日志
sudo tail -f /var/log/mysqld.log  # 实时查看日志
sudo grep ERROR /var/log/mysqld.log  # 查看错误日志

# 配置文件位置
/etc/my.cnf                       # 主配置文件
/var/lib/mysql/                   # 数据目录
```

## 快速配置脚本

如果你想快速完成所有配置，可以创建并执行以下脚本：

```bash
# 获取临时密码
TEMP_PASS=$(sudo grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}')

# 登录并修改密码（需要交互式输入）
mysql -uroot -p"$TEMP_PASS" <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourNewPassword123!';
FLUSH PRIVILEGES;
EOF
```

## 测试连接

```bash
# 测试本地连接
mysql -uroot -p -e "SELECT VERSION();"

# 如果成功，会显示 MySQL 版本号
```

## 下一步

现在 MySQL 已经配置完成，你可以：

1. **连接你的应用** - 使用你创建的数据库和用户
2. **导入数据** - 使用 `mysql` 命令或 `mysqldump` 导入备份
3. **配置应用连接** - 在你的应用中配置数据库连接信息

## 故障排查

### 忘记 root 密码？

```bash
# 1. 停止 MySQL
sudo systemctl stop mysqld

# 2. 启动 MySQL 跳过权限检查
sudo mysqld_safe --skip-grant-tables &

# 3. 登录 MySQL（无需密码）
mysql -uroot

# 4. 修改密码
ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword123!';
FLUSH PRIVILEGES;
EXIT;

# 5. 重启 MySQL
sudo systemctl restart mysqld
```

### 服务启动失败？

```bash
# 查看错误日志
sudo tail -50 /var/log/mysqld.log

# 检查端口占用
sudo netstat -tlnp | grep 3306
```

---

**🎉 恭喜！MySQL 安装和配置完成！**












