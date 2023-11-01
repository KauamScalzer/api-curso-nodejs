import { CreateUserController } from '../../../presentation/controllers/user'
import { EmailValidatorAdapter } from '../../../utils'
import { CreateUserUsecase } from '../../../data/usecases/user'
import { BcryptAdapter } from '../../../infra/criptography'
import { CreateUser } from '../../../infra/db/repositories/user'
import { CreateLogError } from '../../../infra/db/repositories/log-error'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators'

export const makeCreateUserController = (): Controller => {
  const salt = 12
  const createUser = new CreateUser()
  const bcryptAdapter = new BcryptAdapter(salt)
  const createUserUsecase = new CreateUserUsecase(bcryptAdapter, createUser)
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const createUserController = new CreateUserController(emailValidatorAdapter, createUserUsecase)
  const createLogError = new CreateLogError()
  return new LogControllerDecorator(createUserController, createLogError)
}
