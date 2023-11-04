import { UserModel } from 'domain/models'
import { CreateUserModel } from 'domain/usecases/user'

export interface ICreateUserRepository {
  create (data: CreateUserModel): Promise<UserModel>
}
