import { GetOneUserByEmailRepository } from 'data/protocols/user'
import { IUserAuthenticationUsecase, UserAuthenticationModel } from 'domain/usecases/user'

export class UserAuthenticationUsecase implements IUserAuthenticationUsecase {
  constructor (
    private readonly getOneUserByEmailRepository: GetOneUserByEmailRepository
  ) {}

  async auth (data: UserAuthenticationModel): Promise<string | null> {
    await this.getOneUserByEmailRepository.getOne(data.email)
    return ''
  }
}
