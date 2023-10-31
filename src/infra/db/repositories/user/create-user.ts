import { CreateUserRepository } from 'data/protocols/user'
import { UserModel } from 'domain/models'
import { CreateUserModel } from 'domain/usecases/user'
import { User } from '../../typeorm/models'
import { getRepository } from 'typeorm'

export class CreateUser implements CreateUserRepository {
  async create (data: CreateUserModel): Promise<UserModel> {
    const entity = new User()
    Object.assign(entity, data)
    const repository = getRepository(User)
    const result = await repository.save(entity)
    return result
  }
}
