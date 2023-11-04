import { UserModel } from 'domain/models'

export interface GetOneUserByEmailRepository {
  getOne (data: string): Promise<UserModel>
}
