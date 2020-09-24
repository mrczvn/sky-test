import { AccessDeniedError } from '../helpers/errors/access-denied-error'
import { forbidden } from '../helpers/http'
import {
  IHttpRequest,
  IHttpResponse,
  ILoadAccountByToken,
  IMiddleware
} from '../helpers/interfaces'

export class AuthMiddleware implements IMiddleware {
  constructor(private readonly loadAccounByToken: ILoadAccountByToken) {}

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = req.headers?.authorization

    if (accessToken) {
      await this.loadAccounByToken.load(accessToken)
    }

    return forbidden(new AccessDeniedError('Não autorizado'))
  }
}
