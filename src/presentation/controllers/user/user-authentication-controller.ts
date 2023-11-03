import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http'
import { UserAuthentication } from '../../../domain/usecases/user'
import { Validation } from '../../helpers/validators'

export class UserAuthenticationController implements Controller {
  constructor (
    private readonly userAuthentication: UserAuthentication,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, password } = httpRequest.body
      const accessToken = await this.userAuthentication.auth({
        email,
        password
      })
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
