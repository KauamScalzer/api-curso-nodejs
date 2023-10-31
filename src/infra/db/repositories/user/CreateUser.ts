import { CreateAccountRepository } from 'data/protocols/account'
import { AccountModel } from 'domain/models'
import { CreateAccountModel } from 'domain/usecases/account'
import { User } from '../../typeorm/models'
import { getRepository } from 'typeorm'

export class CreateUser implements CreateAccountRepository {
  async create (data: CreateAccountModel): Promise<AccountModel> {
    const entity = new User()
    Object.assign(entity, data)
    const repository = getRepository(User)
    const result = await repository.save(entity)
    return result
  }
}
