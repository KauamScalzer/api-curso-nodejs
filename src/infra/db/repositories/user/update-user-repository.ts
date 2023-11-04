import { IUpdateUserRepository, UpdateUserRepositoryParams } from '../../../../data/protocols/user'
import { User } from '../../typeorm/models'
import { getRepository } from 'typeorm'

export class UpdateUserRepository implements IUpdateUserRepository {
  async update (id: number, data: UpdateUserRepositoryParams): Promise<void> {
    const entity = new User()
    Object.assign(entity, data)
    const repository = getRepository(User)
    await repository.update(id, entity)
  }
}
