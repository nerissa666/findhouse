-- MySQL 密码设置指南
-- 错误原因：密码 nerissa@666 缺少大写字母

-- 方案一：使用包含大写字母的密码（推荐）
ALTER USER 'root'@'localhost' IDENTIFIED BY 'Nerissa@666';
FLUSH PRIVILEGES;

-- 或者使用其他符合要求的密码
-- ALTER USER 'root'@'localhost' IDENTIFIED BY 'Nerissa666@';
-- ALTER USER 'root'@'localhost' IDENTIFIED BY 'NERISSA@666';






