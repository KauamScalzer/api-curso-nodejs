import { Controller, HttpRequest, HttpResponse } from '../../presentation/protocols'
import { CreateLogErrorRepository } from '../../data/protocols/log-error'

export class LogControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly createLogErrorRepository: CreateLogErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.createLogErrorRepository.create(httpResponse.body.stack)
    }
    return httpResponse
  }
}
