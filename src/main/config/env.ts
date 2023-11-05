export default {
  dbNameTest: process.env.DB_NAME ?? 'api_test',
  dbName: process.env.DB_NAME ?? 'api',
  dbUserName: process.env.DB_USERNAME ?? 'root',
  dbPassword: process.env.DB_PASSWORD ?? 'root',
  dbHost: process.env.DB_HOST ?? 'localhost',
  dbPort: process.env.DB_PORT ?? 3306,
  port: process.env.PORT ?? 5050
}
