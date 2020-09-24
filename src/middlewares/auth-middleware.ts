import { AccessDeniedError } from '../helpers/errors/access-denied-error'
import { forbidden } from '../helpers/http'
import { IHttpRequest, IHttpResponse, IMiddleware } from '../helpers/interfaces'

export class AuthMiddleware implements IMiddleware {
  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    const error = forbidden(new AccessDeniedError('Não autorizado'))

    return new Promise((resolve) => resolve(error))
  }
}
