import { ServerError } from '../errors'
import { HttpResponse } from '../protocols'

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})
