import { UserModel } from 'domain/models'

export interface GetOneUserByEmailRepository {
  getOne (email: string): Promise<UserModel | undefined>
}
