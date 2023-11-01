import { CreateLogErrorRepository } from '../../../../data/protocols/log-error'
import { LogError } from '../../typeorm/models'
import { getRepository } from 'typeorm'

export class CreateLogError implements CreateLogErrorRepository {
  async create (data: string): Promise<void> {
    const repository = getRepository(LogError)
    await repository.save({
      stack: data,
      date: new Date()
    })
  }
}
