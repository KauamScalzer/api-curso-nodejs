import { UserModel } from 'domain/models'

export interface CreateUserModel {
  name: string
  email: string
  password: string
}

export interface ICreateUserUsecase {
  create (data: CreateUserModel): Promise<UserModel>
}
