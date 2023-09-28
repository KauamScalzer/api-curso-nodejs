import { CreateAccount, CreateAccountModel } from 'domain/usecases/account'
import { AccountModel } from 'domain/models'
import { Encrypter } from '../../protocols/encrypter'
import { CreateAccountRepository } from 'data/protocols/account'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly encrypter: Encrypter,
    private readonly createAccount: CreateAccountRepository
  ) {}

  async create (data: CreateAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypter.encrypt(data.password)
    await this.createAccount.create(Object.assign({}, data, { password: hashedPassword }))
    return await new Promise(resolve => resolve({
      id: 1,
      name: '',
      email: '',
      password: ''
    }))
  }
}
