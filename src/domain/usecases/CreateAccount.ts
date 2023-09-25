import { AccountModel } from '../models'

export interface CreateAccountModel {
  name: string
  email: string
  password: string
}

export interface CreateAccount {
  create (account: CreateAccountModel): AccountModel
}
