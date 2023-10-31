import { Connection, ConnectionOptions, createConnection } from 'typeorm'

export const TypeormHelper = {
  connection: null as Connection | null,

  async connect () {
    const connectionOptions: ConnectionOptions = {
      type: 'mysql',
      name: 'default',
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
    this.connection = await createConnection(connectionOptions)
  },

  async desconnect () {
    if (this.connection) {
      await this.connection.close()
    }
  }
}
