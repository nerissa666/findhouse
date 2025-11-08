# CentOS MySQL 安装指南

## 方式一：使用安装脚本（推荐）

### 执行步骤

```bash
# 1. 进入项目目录（如果是本地文件，需要先上传到服务器）
cd /path/to/findhouse

# 2. 给脚本添加执行权限（如果还没有权限）
chmod +x install-mysql-centos.sh

# 3. 执行脚本
./install-mysql-centos.sh
```

### 说明

- **如果脚本没有执行权限**，会提示 `Permission denied`，需要先执行 `chmod +x install-mysql-centos.sh`
- **使用 `./` 前缀**：表示执行当前目录下的脚本文件
- **或者使用 bash 命令**：`bash install-mysql-centos.sh`（不需要执行权限）
- **需要 root 权限**：脚本中使用了 `sudo`，执行时可能需要输入密码

## 方式二：手动安装步骤

### CentOS 7 安装 MySQL 8.0

```bash
# 1. 下载 MySQL Yum Repository
wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm

# 2. 安装 Repository
sudo rpm -ivh mysql80-community-release-el7-3.noarch.rpm

# 3. 安装 MySQL Server
sudo yum install -y mysql-community-server

# 4. 启动 MySQL 服务
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 5. 查看临时密码
sudo grep 'temporary password' /var/log/mysqld.log
```

### CentOS 8/9 安装 MySQL 8.0

```bash
# 1. 下载 MySQL Yum Repository (CentOS 8)
wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm

# 或 CentOS 9
wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm

# 2. 安装 Repository
sudo rpm -ivh mysql80-community-release-el8-1.noarch.rpm

# 3. 安装 MySQL Server
sudo yum install -y mysql-community-server

# 4. 启动 MySQL 服务
sudo systemctl start mysqld
sudo systemctl enable mysqld

# 5. 查看临时密码
sudo grep 'temporary password' /var/log/mysqld.log
```

### 安装 MySQL 5.7（CentOS 7）

```bash
# 1. 下载 MySQL Yum Repository
wget https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm

# 2. 安装 Repository
sudo rpm -ivh mysql57-community-release-el7-11.noarch.rpm

# 3. 禁用 MySQL 8.0，启用 MySQL 5.7
sudo yum-config-manager --disable mysql80-community
sudo yum-config-manager --enable mysql57-community

# 4. 安装 MySQL Server
sudo yum install -y mysql-community-server

# 5. 启动 MySQL 服务
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

## 初始化配置

### 1. 登录 MySQL（使用临时密码）

```bash
mysql -uroot -p
# 输入从日志中获取的临时密码
```

### 2. 修改 root 密码

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourNewPassword123!';
FLUSH PRIVILEGES;
```

### 3. 创建新用户（可选）

```sql
CREATE USER 'your_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON *.* TO 'your_user'@'localhost';
FLUSH PRIVILEGES;
```

### 4. 允许远程连接（可选）

```sql
-- 修改 root 用户允许远程连接
ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourPassword123!';
CREATE USER 'root'@'%' IDENTIFIED BY 'YourPassword123!';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
FLUSH PRIVILEGES;

-- 或者创建新用户用于远程连接
CREATE USER 'remote_user'@'%' IDENTIFIED BY 'RemotePassword123!';
GRANT ALL PRIVILEGES ON *.* TO 'remote_user'@'%';
FLUSH PRIVILEGES;
```

### 5. 配置防火墙（如果需要远程连接）

```bash
# CentOS 7
sudo firewall-cmd --permanent --add-service=mysql
sudo firewall-cmd --reload

# CentOS 8/9
sudo firewall-cmd --permanent --add-service=mysql
sudo firewall-cmd --reload
```

## 常用命令

```bash
# 启动 MySQL
sudo systemctl start mysqld

# 停止 MySQL
sudo systemctl stop mysqld

# 重启 MySQL
sudo systemctl restart mysqld

# 查看状态
sudo systemctl status mysqld

# 登录 MySQL
mysql -uroot -p

# 查看 MySQL 版本
mysql --version

# 查看 MySQL 配置
mysqladmin -uroot -p variables
```

## 配置文件位置

- MySQL 配置文件: `/etc/my.cnf`
- MySQL 数据目录: `/var/lib/mysql`
- MySQL 日志文件: `/var/log/mysqld.log`
- MySQL 错误日志: `/var/log/mysqld.log`

## 性能优化（可选）

编辑 `/etc/my.cnf` 文件：

```ini
[mysqld]
# 基本配置
port = 3306
datadir = /var/lib/mysql
socket = /var/lib/mysql/mysql.sock

# 字符集
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci

# 连接数
max_connections = 200
max_connect_errors = 10

# 缓存
innodb_buffer_pool_size = 1G
query_cache_size = 64M
query_cache_type = 1

# 日志
slow_query_log = 1
slow_query_log_file = /var/log/mysql-slow.log
long_query_time = 2

[client]
default-character-set=utf8mb4
```

修改配置后需要重启 MySQL：

```bash
sudo systemctl restart mysqld
```

## 安全加固

```bash
# 运行 MySQL 安全配置向导
sudo mysql_secure_installation
```

这会引导你：

- 设置 root 密码
- 删除匿名用户
- 禁止 root 远程登录
- 删除测试数据库
- 重新加载权限表

## 故障排查

### 警告信息说明

#### 1. "package mysql80-community-release is already installed"

**含义：** MySQL Repository 已经安装过了。

**处理：** 这是正常提示，可以忽略，脚本会自动跳过安装步骤。

#### 2. "warning: ... NOKEY"

**含义：** RPM 包的 GPG 签名密钥未导入。

**处理：** 可以忽略，不影响安装。脚本会自动导入密钥。如果想手动导入：

```bash
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
```

#### 3. "Error: GPG check FAILED"

**含义：** GPG 密钥验证失败，导入的密钥与包签名不匹配。

**错误示例：**

```
Import of key(s) didn't help, wrong key(s)?
Public key for mysql-community-server-8.0.44-1.el8.x86_64.rpm is not installed.
Error: GPG check FAILED
```

**原因：**

- MySQL 8.0 的新版本包使用了新的 GPG 密钥
- 旧的密钥（0x5072E1F5）不再适用于新版本

**解决方案：**

```bash
# 方法一：直接使用 --nogpgcheck（推荐，快速解决）
sudo dnf install -y mysql-community-server --nogpgcheck

# 方法二：导入正确的 GPG 密钥（如果方法一不行）
# 先删除旧的密钥
sudo rpm -e gpg-pubkey-5072e1f5-* 2>/dev/null || true

# 导入新的密钥
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022
sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-8.0

# 然后重新安装
sudo dnf install -y mysql-community-server

# 方法三：从 repository 文件获取密钥
# 检查 repository 配置中的 GPG 密钥路径
cat /etc/yum.repos.d/mysql-community*.repo | grep gpgkey
# 然后从指定 URL 导入
```

### 错误：All matches were filtered out by modular filtering (CentOS 8/9)

**问题描述：**

```
All matches were filtered out by modular filtering for argument: mysql-community-server
Error: Unable to find a match: mysql-community-server
```

**原因：**
CentOS 8/9 使用了模块化仓库系统，系统自带的 MySQL 模块会过滤掉 MySQL Community Server。

**解决方案：**

```bash
# 方法一：禁用系统自带的 MySQL 模块（推荐）
sudo dnf module disable -y mysql

# 然后重新安装
sudo dnf install -y mysql-community-server

# 方法二：如果方法一不行，使用 --nogpgcheck 参数
sudo dnf install -y mysql-community-server --nogpgcheck

# 方法三：如果还是不行，清除缓存并重新安装
sudo dnf clean all
sudo dnf makecache
sudo dnf module disable -y mysql
sudo dnf install -y mysql-community-server
```

**验证模块状态：**

```bash
# 查看 MySQL 模块状态
dnf module list mysql

# 如果显示 enabled，需要禁用它
sudo dnf module disable -y mysql
```

### 查看 MySQL 错误日志

```bash
sudo tail -f /var/log/mysqld.log
```

### 检查 MySQL 进程

```bash
ps aux | grep mysql
```

### 检查端口是否监听

```bash
netstat -tlnp | grep 3306
# 或
ss -tlnp | grep 3306
```
