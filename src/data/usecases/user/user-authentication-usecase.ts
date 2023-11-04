import { HashComparer, Encrypter } from 'data/protocols/criptography'
import { GetOneUserByEmailRepository, UpdateUserRepository } from 'data/protocols/user'
import { IUserAuthenticationUsecase, UserAuthenticationModel } from 'domain/usecases/user'

export class UserAuthenticationUsecase implements IUserAuthenticationUsecase {
  constructor (
    private readonly getOneUserByEmailRepository: GetOneUserByEmailRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
    private readonly updateUserRepository: UpdateUserRepository
  ) {}

  async auth (data: UserAuthenticationModel): Promise<string | null> {
    const user = await this.getOneUserByEmailRepository.getOne(data.email)
    if (user) {
      const isValid = await this.hashComparer.compare(data.password, user.password)
      if (isValid) {
        const accessToken = await this.encrypter.encrypt(user.id.toString())
        await this.updateUserRepository.update(user.id, { accessToken })
        return accessToken
      }
    }
    return null
  }
}
