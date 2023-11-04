import { ICreateUserUsecase, CreateUserModel } from '../../../domain/usecases/user'
import { UserModel } from '../../../domain/models'
import { Encrypter } from '../../protocols/criptography'
import { CreateUserRepository } from '../../../data/protocols/user'

export class CreateUserUsecase implements ICreateUserUsecase {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly createUser: CreateUserRepository
  ) {}

  async create (data: CreateUserModel): Promise<UserModel> {
    const hashedPassword = await this.encrypter.encrypt(data.password)
    const result = await this.createUser.create(Object.assign({}, data, { password: hashedPassword }))
    return result
  }
}
