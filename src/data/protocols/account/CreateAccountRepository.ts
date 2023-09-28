import { AccountModel } from 'domain/models'
import { CreateAccountModel } from 'domain/usecases/account'

export interface CreateAccountRepository {
  create (data: CreateAccountModel): Promise<AccountModel>
}
