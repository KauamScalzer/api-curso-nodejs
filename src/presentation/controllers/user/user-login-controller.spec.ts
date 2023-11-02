import { UserLoginController } from './user-login-controller'
import { badRequest } from '../../helpers'
import { MissingParamError } from '../../errors'

interface SutTypes {
  sut: UserLoginController
}

const makeSut = (): SutTypes => {
  const sut = new UserLoginController()
  return {
    sut
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
})
