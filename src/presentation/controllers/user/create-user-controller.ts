import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../../protocols'
import { MissingParamError, InvalidParamError } from '../../errors'
import { badRequest, serverError, ok } from '../../helpers'
import { ICreateUserUsecase } from '../../../domain/usecases/user'

export class CreateUserController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly createUser: ICreateUserUsecase
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { name, email, password, passwordConfirmation } = httpRequest.body
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const result = await this.createUser.create({
        name,
        email,
        password
      })
      return ok(result)
    } catch (error: any) {
      console.log(error)
      return serverError(error)
    }
  }
}
