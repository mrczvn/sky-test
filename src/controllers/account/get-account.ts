import { ok, serverError } from '../../helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../helpers/interfaces'
import { dateToString } from '../../utils/date-to-string'

export class GetAccount implements IController {
  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const account = req.body.mensagem

      return ok({
        ...account,
        data_criacao: dateToString(account.data_criacao),
        data_atualizacao: dateToString(account.data_atualizacao),
        ultimo_login: dateToString(account.ultimo_login)
      })
    } catch (error) {
      serverError()
    }
  }
}
