import { UserModel } from 'domain/models'
import { CreateUserModel } from 'domain/usecases/user'

export interface CreateUserRepository {
  create (data: CreateUserModel): Promise<UserModel>
}
