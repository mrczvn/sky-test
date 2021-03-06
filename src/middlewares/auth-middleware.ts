import {
  IHttpRequest,
  IHttpResponse,
  IMiddleware,
  ILoadAccountByToken
} from './auth-middleware-interfaces'
import { forbidden, ok, serverError } from '@/helpers/http'
import { AccessDeniedError } from '@/helpers/errors'

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly loadAccountByToken: ILoadAccountByToken) {}

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const authorization = req.headers?.authorization

      if (authorization) {
        const [, accessToken] = authorization.split(' ')

        const account = await this.loadAccountByToken.load(accessToken)

        if (account) return ok({ accountId: account.id })
      }
      return forbidden(new AccessDeniedError('Não autorizado'))
    } catch (error) {
      return serverError()
    }
  }
}
