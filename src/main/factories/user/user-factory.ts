import { SignUpController } from '../../../presentation/controllers/SignUpController'
import { EmailValidatorAdapter } from '../../../utils/EmailValidatorAdapter'
import { DbCreateAccount } from '../../../data/usecases/account/DbCreateAccount'
import { BcryptAdapter } from '../../../infra/criptography/BcryptAdapter'
import { CreateUser } from '../../../infra/db/repositories/user/CreateUser'

export const makeUserController = (): SignUpController => {
  const salt = 12
  const createUser = new CreateUser()
  const bcryptAdapter = new BcryptAdapter(salt)
  const dbCreateAccount = new DbCreateAccount(bcryptAdapter, createUser)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const signUpController = new SignUpController(emailValidatorAdapter, dbCreateAccount)
  return signUpController
}
