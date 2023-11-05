import 'reflect-metadata'
import { ConnectionOptions, createConnection } from 'typeorm'
import env from './config/env'

const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  name: 'default',
  username: env.dbUserName,
  password: env.dbPassword,
  database: env.dbName,
  host: env.dbHost,
  port: env.dbPort as number,
  synchronize: true,
  logging: false,
  entities: [
    'src/infra/db/typeorm/models/*.ts',
    './dist/infra/db/typeorm/models/*.js'
  ]
}

const connection = createConnection(connectionOptions)
connection.then(async () => {
  const app = (await import('./config/app')).default
  app.listen(env.port, () => console.log(`Server running at localhost:${env.port}`))
}).catch(console.error)
