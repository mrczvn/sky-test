import { AccessDeniedError } from '../helpers/errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http'
import {
  IHttpRequest,
  IHttpResponse,
  ILoadAccountByToken,
  IMiddleware
} from '../helpers/interfaces'

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly loadAccountByToken: ILoadAccountByToken) {}

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const authorization = req.headers?.authorization

      if (authorization) {
        const [, accessToken] = authorization.split(' ')

        const account = await this.loadAccountByToken.load(accessToken)

        if (account) return ok({ user: account })
      }
      return forbidden(new AccessDeniedError('Não autorizado'))
    } catch (error) {
      return serverError()
    }
  }
}
