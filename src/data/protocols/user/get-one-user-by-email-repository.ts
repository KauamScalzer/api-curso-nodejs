import { UserModel } from 'domain/models'

export interface IGetOneUserByEmailRepository {
  getOne (email: string): Promise<UserModel | undefined>
}
