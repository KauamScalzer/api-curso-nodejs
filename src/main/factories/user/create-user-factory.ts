import { CreateUserController } from '../../../presentation/controllers/user'
import { CreateUserUsecase } from '../../../data/usecases/user'
import { BcryptAdapter } from '../../../infra/criptography'
import { CreateUser } from '../../../infra/db/repositories/user'
import { CreateLogError } from '../../../infra/db/repositories/log-error'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators'
import { makeCreateUserValidation } from './create-user-validation-factory'

export const makeCreateUserController = (): Controller => {
  const salt = 12
  const createUser = new CreateUser()
  const bcryptAdapter = new BcryptAdapter(salt)
  const createUserUsecase = new CreateUserUsecase(bcryptAdapter, createUser)
  const createUserController = new CreateUserController(createUserUsecase, makeCreateUserValidation())
  const createLogError = new CreateLogError()
  return new LogControllerDecorator(createUserController, createLogError)
}
