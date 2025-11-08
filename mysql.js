module.exports = {
  // 数据库类型
  dialect: 'mysql',
  // 数据库主机地址
  host: 'localhost',
  // 用户名
  user: 'root',
  // 密码（MySQL 8.0 要求：大小写字母 + 数字 + 特殊字符）
  pass: 'Nerissa@666',  // 注意：第一个字母改为大写 N
  // pass: '88888888',
  // 端口号
  port: 3306,
  // 数据库名
  database: 'lookname',
  // 是否允许 query中写多个查询语句
  multipleStatements: false,
  pool: {
    max: 5, // 连接池中最大连接数量
    min: 0, // 连接池中最小连接数量
    idle: 10000 // 如果一个线程 10 秒钟内没有被使用过的话，那么就释放线程
  }
}
