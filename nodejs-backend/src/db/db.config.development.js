module.exports = {
  username: 'postgres',
  dialect: 'postgres',
  password: '12345',
  database: 'development',
  host: process.env.DEV_DB_HOST || 'localhost',
  logging: console.log,
};
