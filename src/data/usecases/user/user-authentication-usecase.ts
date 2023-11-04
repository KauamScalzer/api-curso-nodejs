import { HashComparer, TokenGenerator } from 'data/protocols/criptography'
import { GetOneUserByEmailRepository } from 'data/protocols/user'
import { IUserAuthenticationUsecase, UserAuthenticationModel } from 'domain/usecases/user'

export class UserAuthenticationUsecase implements IUserAuthenticationUsecase {
  constructor (
    private readonly getOneUserByEmailRepository: GetOneUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly tokenGenerator: TokenGenerator
  ) {}

  async auth (data: UserAuthenticationModel): Promise<string | null> {
    const user = await this.getOneUserByEmailRepository.getOne(data.email)
    if (user) {
      const isValid = await this.hashComparer.compare(data.password, user.password)
      if (isValid) {
        const acessToken = await this.tokenGenerator.generate(user.id)
        return acessToken
      }
    }
    return null
  }
}
