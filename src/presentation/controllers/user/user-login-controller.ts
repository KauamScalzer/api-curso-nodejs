import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, ok, serverError } from '../../helpers'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../../../presentation/protocols'
import { UserAuthentication } from '../../../domain/usecases/user'

export class UserLoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly userAuthentication: UserAuthentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { email, password } = httpRequest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      await this.userAuthentication.auth(email, password)
      return ok('')
    } catch (error: any) {
      return serverError(error)
    }
  }
}
