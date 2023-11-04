import { ICreateUserUsecase, CreateUserModel } from '../../../domain/usecases/user'
import { UserModel } from '../../../domain/models'
import { Hasher } from '../../protocols/criptography'
import { CreateUserRepository } from '../../../data/protocols/user'

export class CreateUserUsecase implements ICreateUserUsecase {
  constructor (
    private readonly hasher: Hasher,
    private readonly createUser: CreateUserRepository
  ) {}

  async create (data: CreateUserModel): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(data.password)
    const result = await this.createUser.create(Object.assign({}, data, { password: hashedPassword }))
    return result
  }
}
