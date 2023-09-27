import { CreateAccount, CreateAccountModel } from 'domain/usecases/account'
import { AccountModel } from 'domain/models'
import { Encrypter } from '../../protocols/encrypter'

export class DbCreateAccount implements CreateAccount {
  constructor (
    private readonly encrypter: Encrypter
  ) {}

  async create (account: CreateAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return await new Promise(resolve => resolve({
      id: 1,
      name: '',
      email: '',
      password: ''
    }))
  }
}
