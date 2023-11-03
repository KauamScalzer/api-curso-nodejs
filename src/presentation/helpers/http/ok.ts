import { HttpResponse } from '../../protocols'

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
