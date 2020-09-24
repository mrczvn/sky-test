import { AccessDeniedError } from '../helpers/errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http'
import {
  IHttpRequest,
  IHttpResponse,
  ILoadAccountByToken,
  IMiddleware
} from '../helpers/interfaces'

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly loadAccounByToken: ILoadAccountByToken) {}

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const accessToken = req.headers?.authorization

      if (accessToken) {
        const account = await this.loadAccounByToken.load(accessToken)

        if (account) return ok(account)
      }
      return forbidden(new AccessDeniedError('Não autorizado'))
    } catch (error) {
      return serverError()
    }
  }
}
