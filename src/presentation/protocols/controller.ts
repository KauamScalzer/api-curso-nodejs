import { httpRequest, httpResponse } from '../protocols'

export interface Controller {
  handle (httpRequest: httpRequest): httpResponse
}
