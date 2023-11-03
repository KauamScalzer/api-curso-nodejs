import { UserLoginController } from './user-login-controller'
import { badRequest, serverError, unauthorized } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator, HttpRequest } from '../../../presentation/protocols'
import { UserAuthentication } from '../../../domain/usecases/user'

const makeUserAuthentication = (): UserAuthentication => {
  class UserAuthenticationStub implements UserAuthentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new UserAuthenticationStub()
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}
interface SutTypes {
  sut: UserLoginController
  emailValidatorStub: EmailValidator
  userAuthenticationStub: UserAuthentication
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const userAuthenticationStub = makeUserAuthentication()
  const sut = new UserLoginController(emailValidatorStub, userAuthenticationStub)
  return {
    sut,
    emailValidatorStub,
    userAuthenticationStub
  }
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    password: 'any_password',
    email: 'any_mail@email.com'
  }
})

describe('UserLoginController', () => {
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@email.com')
  })

  test('Should call UserAuthentication with correct values', async () => {
    const { sut, userAuthenticationStub } = makeSut()
    const authSpy = jest.spyOn(userAuthenticationStub, 'auth')
    await sut.handle(makeFakeRequest())
    expect(authSpy).toHaveBeenCalledWith('any_mail@email.com', 'any_password')
  })

  test('Should return 500 if UserAuthentication throws', async () => {
    const { sut, userAuthenticationStub } = makeSut()
    jest.spyOn(userAuthenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(serverError(new Error()))
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, userAuthenticationStub } = makeSut()
    jest.spyOn(userAuthenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = await sut.handle(makeFakeRequest())
    expect(httpRequest).toEqual(unauthorized())
  })
})
