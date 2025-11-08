#!/bin/bash

# CentOS MySQL 安装脚本
# 适用于 CentOS 7/8/9

set -e

echo "开始安装 MySQL..."

# 检查系统版本
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
    VERSION=$VERSION_ID
    echo "检测到系统: $OS $VERSION"
else
    echo "无法检测系统版本"
    exit 1
fi

# 根据系统版本选择安装方式
if [[ "$OS" == "centos" ]] || [[ "$OS" == "rhel" ]]; then
    # CentOS 7 或 RHEL 7
    if [[ "$VERSION" == "7"* ]]; then
        echo "使用 MySQL 5.7 仓库安装 (CentOS 7)"
        
        # 下载 MySQL Yum Repository
        if [ ! -f mysql80-community-release-el7-3.noarch.rpm ]; then
            wget https://dev.mysql.com/get/mysql80-community-release-el7-3.noarch.rpm
        fi
        
        # 检查是否已安装 MySQL Repository
        if rpm -q mysql80-community-release >/dev/null 2>&1; then
            echo "MySQL Repository 已经安装，跳过安装步骤"
        else
            # 安装 MySQL Repository
            echo "安装 MySQL Repository..."
            sudo rpm -ivh mysql80-community-release-el7-3.noarch.rpm
        fi
        
        # 导入 GPG 密钥（解决 NOKEY 警告）
        echo "导入 MySQL GPG 密钥..."
        sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022 2>/dev/null || \
        sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql 2>/dev/null || true
        
        # 或者如果要安装 MySQL 5.7，取消注释下面的行并注释掉上面的行
        # sudo yum-config-manager --disable mysql80-community
        # sudo yum-config-manager --enable mysql57-community
        
    # CentOS 8+ 或 RHEL 8+
    elif [[ "$VERSION" == "8"* ]] || [[ "$VERSION" == "9"* ]]; then
        echo "使用 MySQL 8.0 仓库安装 (CentOS 8/9)"
        
        # 禁用 AppStream 中的 MySQL 模块（解决 modular filtering 问题）
        echo "禁用系统自带的 MySQL 模块..."
        sudo dnf module disable -y mysql 2>/dev/null || true
        
        # 下载 MySQL Yum Repository
        if [[ "$VERSION" == "8"* ]]; then
            if [ ! -f mysql80-community-release-el8-1.noarch.rpm ]; then
                wget https://dev.mysql.com/get/mysql80-community-release-el8-1.noarch.rpm
            fi
            REPO_FILE="mysql80-community-release-el8-1.noarch.rpm"
        else
            if [ ! -f mysql80-community-release-el9-1.noarch.rpm ]; then
                wget https://dev.mysql.com/get/mysql80-community-release-el9-1.noarch.rpm
            fi
            REPO_FILE="mysql80-community-release-el9-1.noarch.rpm"
        fi
        
        # 检查是否已安装 MySQL Repository
        if rpm -q mysql80-community-release >/dev/null 2>&1; then
            echo "MySQL Repository 已经安装，跳过安装步骤"
        else
            # 安装 MySQL Repository
            echo "安装 MySQL Repository..."
            sudo rpm -ivh $REPO_FILE
        fi
        
        # 导入 GPG 密钥（解决 GPG 验证失败问题）
        echo "导入 MySQL GPG 密钥..."
        # 尝试多个可能的密钥 URL
        sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-2022 2>/dev/null || \
        sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql-8.0 2>/dev/null || \
        sudo rpm --import https://repo.mysql.com/RPM-GPG-KEY-mysql 2>/dev/null || \
        sudo rpm --import /etc/pki/rpm-gpg/RPM-GPG-KEY-mysql-2022 2>/dev/null || \
        echo "警告: 无法导入 GPG 密钥，将使用 --nogpgcheck 参数"
        
        # 使用 dnf 而不是 yum（CentOS 8+ 推荐使用 dnf）
        INSTALL_CMD="dnf"
        USE_NOGPGCHECK=true  # 如果密钥导入失败，使用此选项
    fi
    
    # 安装 MySQL Server
    echo "正在安装 MySQL Server..."
    if [ -z "$INSTALL_CMD" ]; then
        sudo yum install -y mysql-community-server
    else
        # CentOS 8+ 可能遇到 GPG 密钥问题，先尝试正常安装
        echo "尝试安装 MySQL Server（如果需要，将自动处理 GPG 验证）..."
        if ! sudo dnf install -y mysql-community-server 2>&1; then
            echo "检测到安装失败，可能是 GPG 验证问题，使用 --nogpgcheck 重新安装..."
            sudo dnf install -y mysql-community-server --nogpgcheck
        fi
    fi
    
    # 启动 MySQL 服务
    echo "启动 MySQL 服务..."
    sudo systemctl start mysqld
    sudo systemctl enable mysqld
    
    # 获取临时密码
    if [ -f /var/log/mysqld.log ]; then
        TEMP_PASSWORD=$(sudo grep 'temporary password' /var/log/mysqld.log | awk '{print $NF}')
        if [ ! -z "$TEMP_PASSWORD" ]; then
            echo "=========================================="
            echo "MySQL 临时密码: $TEMP_PASSWORD"
            echo "=========================================="
            echo "请使用以下命令登录并修改密码:"
            echo "mysql -uroot -p'$TEMP_PASSWORD'"
            echo ""
            echo "登录后执行:"
            echo "ALTER USER 'root'@'localhost' IDENTIFIED BY 'YourNewPassword123!';"
            echo "FLUSH PRIVILEGES;"
            echo "=========================================="
        fi
    fi
    
    echo "MySQL 安装完成！"
    echo ""
    echo "常用命令:"
    echo "  启动服务: sudo systemctl start mysqld"
    echo "  停止服务: sudo systemctl stop mysqld"
    echo "  重启服务: sudo systemctl restart mysqld"
    echo "  查看状态: sudo systemctl status mysqld"
    echo "  登录MySQL: mysql -uroot -p"
    
elif [[ "$OS" == "fedora" ]]; then
    echo "Fedora 系统，使用 dnf 安装..."
    sudo dnf install -y mysql-server
    sudo systemctl start mysqld
    sudo systemctl enable mysqld
else
    echo "不支持的系统: $OS"
    exit 1
fi

