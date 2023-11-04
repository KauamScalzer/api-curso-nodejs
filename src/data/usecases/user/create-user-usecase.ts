import { ICreateUserUsecase, CreateUserModel } from '../../../domain/usecases/user'
import { UserModel } from '../../../domain/models'
import { Hasher } from '../../protocols/criptography'
import { ICreateUserRepository } from '../../../data/protocols/user'

export class CreateUserUsecase implements ICreateUserUsecase {
  constructor (
    private readonly hasher: Hasher,
    private readonly createUserRepository: ICreateUserRepository
  ) {}

  async create (data: CreateUserModel): Promise<UserModel> {
    const hashedPassword = await this.hasher.hash(data.password)
    const result = await this.createUserRepository.create(Object.assign({}, data, { password: hashedPassword }))
    return result
  }
}
