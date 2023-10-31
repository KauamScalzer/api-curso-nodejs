import 'reflect-metadata'
import app from './config/app'
import { ConnectionOptions, createConnection } from 'typeorm'

const connectionOptions: ConnectionOptions = {
  type: 'mysql',
  name: 'api',
  username: 'root',
  password: 'pwd_root',
  database: 'api',
  host: 'localhost',
  port: 3306,
  synchronize: false,
  logging: false,
  entities: [
    'src/infra/db/typeorm/models/*.ts',
    './dist/infra/db/typeorm/models/*.js'
  ]
}

const connection = createConnection(connectionOptions)
connection.then(async () => {
  const app = (await import('./config/app')).default
  app.listen(5050, () => console.log('Server running at localhost:5050'))
}).catch(console.error)
