import { AccessDeniedError } from '../../helpers/errors/access-denied-error'
import { forbidden, ok, serverError } from '../../helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  ILoadAccountByIdRepository
} from '../../helpers/interfaces'
import { compareDate } from '../../utils/compare-date'
import { transformeAccountModel } from '../../utils/transforme-account-model'

export class GetAccountController implements IController {
  constructor(private readonly loadAccountById: ILoadAccountByIdRepository) {}

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const account = req.user

      if (account) {
        const date = new Date()

        const differenceDate = compareDate(date, account.ultimo_login)

        if (differenceDate) return ok(transformeAccountModel(account))

        return forbidden(new AccessDeniedError('Sessão inválida'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
