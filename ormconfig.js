module.exports = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'pwd_root',
  database: 'api',
  synchronize: true,
  logging: true,
  entities: [
    'src/infra/db/typeorm/models/*.ts',
    'dist/infra/db/typeorm/models/*.js'
  ],
  migrations: [
    'src/infra/db/typeorm/migration/*.ts'
  ],
  cli: {
    entitiesDir: 'src/infra/db/typeorm/models',
    migrationsDir: 'src/infra/db/typeorm/migration',
    subscribersDir: 'src/infra/db/typeorm/subscriber'
  }
}
