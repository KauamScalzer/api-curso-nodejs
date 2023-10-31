import { CreateUserController } from '../../../presentation/controllers/user'
import { EmailValidatorAdapter } from '../../../utils'
import { CreateUserUsecase } from '../../../data/usecases/user'
import { BcryptAdapter } from '../../../infra/criptography'
import { CreateUser } from '../../../infra/db/repositories/user'

export const makeCreateUserController = (): CreateUserController => {
  const salt = 12
  const createUser = new CreateUser()
  const bcryptAdapter = new BcryptAdapter(salt)
  const createUserUsecase = new CreateUserUsecase(bcryptAdapter, createUser)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const createUserController = new CreateUserController(emailValidatorAdapter, createUserUsecase)
  return createUserController
}
