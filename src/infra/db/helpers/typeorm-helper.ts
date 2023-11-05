import env from '../../../main/config/env'
import { Connection, ConnectionOptions, createConnection, getConnection, getRepository } from 'typeorm'

export const TypeormHelper = {
  connection: null as Connection | null,

  async connect () {
    const connectionOptions: ConnectionOptions = {
      type: 'mysql',
      name: 'default',
      username: env.dbUserName,
      password: env.dbPassword,
      database: env.dbNameTest,
      host: env.dbHost,
      port: env.dbPort as number,
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
