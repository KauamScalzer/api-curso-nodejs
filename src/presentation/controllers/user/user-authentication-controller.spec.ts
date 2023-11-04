import { UserAuthenticationController } from './user-authentication-controller'
import { badRequest, serverError, unauthorized, ok } from '../../helpers/http'
import { MissingParamError } from '../../errors'
import { HttpRequest } from '../../protocols'
import { IUserAuthenticationUsecase, UserAuthenticationModel } from '../../../domain/usecases/user'
import { Validation } from '../../helpers/validators'

const makeUserAuthenticationUsecase = (): IUserAuthenticationUsecase => {
  class UserAuthenticationUsecaseStub implements IUserAuthenticationUsecase {
    async auth (data: UserAuthenticationModel): Promise<string | null> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new UserAuthenticationUsecaseStub()
}

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (data: any): Error | undefined {
      return undefined
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: UserAuthenticationController
  userAuthenticationUsecaseStub: IUserAuthenticationUsecase
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const userAuthenticationUsecaseStub = makeUserAuthenticationUsecase()
  const validationStub = makeValidation()
  const sut = new UserAuthenticationController(userAuthenticationUsecaseStub, validationStub)
  return {
    sut,
    userAuthenticationUsecaseStub,
    validationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    password: 'any_password',
    email: 'any_mail@mail.com'
  }
})

describe('UserAuthenticationController', () => {
  test('Should call IUserAuthenticationUsecase with correct values', async () => {
    const { sut, userAuthenticationUsecaseStub } = makeSut()
    const authSpy = jest.spyOn(userAuthenticationUsecaseStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_mail@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if IUserAuthenticationUsecase throws', async () => {
    const { sut, userAuthenticationUsecaseStub } = makeSut()
    jest.spyOn(userAuthenticationUsecaseStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(serverError(new Error()))
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, userAuthenticationUsecaseStub } = makeSut()
    jest.spyOn(userAuthenticationUsecaseStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(unauthorized())
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(makeFakeRequest())
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an Error', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })
})
