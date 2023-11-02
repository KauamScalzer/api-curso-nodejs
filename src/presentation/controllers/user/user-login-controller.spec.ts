import { UserLoginController } from './user-login-controller'
import { badRequest } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../../presentation/protocols'

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
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new UserLoginController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

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
    const httpRequest = {
      body: {
        password: 'any_password',
        email: 'any_mail@email.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        password: 'any_password',
        email: 'any_mail@email.com'
      }
    }
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('any_mail@email.com')
  })
})
