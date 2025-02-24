import { GetAvailableStockNamesUsecase } from 'domain/usecases/get-available-stock-names-usecase'
import { ParamNotProvidedError } from 'presentation/errors/param-not-provided-error'
import { badRequest, ok, serverError } from 'presentation/helpers/http'
import { Controller } from 'presentation/protocols/controller'
import { HttpRequest } from 'presentation/protocols/http-request'
import { HttpResponse } from 'presentation/protocols/http-response'

export class GetAvailableStockNamesController implements Controller {
  constructor (
    private readonly getAvailableStockNamesUsecase: GetAvailableStockNamesUsecase
  ) { }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.query.search) {
        return badRequest(new ParamNotProvidedError('search'))
      }
      const stockNames = await this.getAvailableStockNamesUsecase.getStockNames(httpRequest.query.search)
      return ok(stockNames)
    } catch (err) {
      console.log(err)
      return serverError()
    }
  }
}
