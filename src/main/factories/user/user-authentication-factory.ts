import { UserAuthenticationController } from '../../../presentation/controllers/user'
import { UserAuthenticationUsecase } from '../../../data/usecases/user'
import { GetOneUserByEmailRepository, UpdateUserRepository } from '../../../infra/db/repositories/user'
import { HashComparerBcryptAdapter } from '../../../infra/criptography/bcrypt'
import { EncrypterJwtAdapter } from '../../../infra/criptography/jwt'
import { CreateLogErrorRepository } from '../../../infra/db/repositories/log-error'
import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators'
import { makeCreateUserValidation } from './create-user-validation-factory'

export const makeUserAuthenticationController = (): Controller => {
  const getOneUserByEmailRepository = new GetOneUserByEmailRepository()
  const hashComparerBcryptAdapter = new HashComparerBcryptAdapter()
  const encrypterJwtAdapter = new EncrypterJwtAdapter('')
  const updateUserRepository = new UpdateUserRepository()
  const userAuthenticationUsecase = new UserAuthenticationUsecase(getOneUserByEmailRepository, hashComparerBcryptAdapter, encrypterJwtAdapter, updateUserRepository)
  const userAuthenticationController = new UserAuthenticationController(userAuthenticationUsecase, makeCreateUserValidation())
  const createLogErrorRepository = new CreateLogErrorRepository()
  return new LogControllerDecorator(userAuthenticationController, createLogErrorRepository)
}
