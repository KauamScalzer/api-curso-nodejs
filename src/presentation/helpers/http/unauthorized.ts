import { UnauthorizedError } from '../../errors'
import { HttpResponse } from '../../protocols'

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  body: new UnauthorizedError()
})
