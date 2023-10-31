import { Connection, ConnectionOptions, createConnection, getConnection, getRepository } from 'typeorm'

export const TypeormHelper = {
  connection: null as Connection | null,

  async connect () {
    const connectionOptions: ConnectionOptions = {
      type: 'mysql',
      name: 'default',
      username: 'root',
      password: 'pwd_root',
      database: 'api_test',
      host: 'localhost',
      port: 3306,
      synchronize: true,
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
  },

  async clear (entity: string) {
    const repository = await getRepository(entity)
    await repository.query(`DELETE FROM ${entity}`)
  }
}
