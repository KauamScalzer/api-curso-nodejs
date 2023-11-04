import { UserModel } from 'domain/models'
import { GetOneUserByEmailRepository } from '../../../../data/protocols/user'
import { User } from '../../typeorm/models'
import { getRepository } from 'typeorm'

export class GetOneUserByEmail implements GetOneUserByEmailRepository {
  async getOne (email: string): Promise<UserModel | undefined> {
    const repository = getRepository(User)
    const result = await repository.findOne({ where: { email: email } })
    return result
  }
}
