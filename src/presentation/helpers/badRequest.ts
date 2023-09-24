import { httpResponse } from 'presentation/protocols'

export const badRequest = (error: Error): httpResponse => ({
  statusCode: 400,
  body: error
})
