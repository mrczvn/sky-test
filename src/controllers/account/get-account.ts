import { AccessDeniedError } from '../../helpers/errors/access-denied-error'
import { forbidden, ok, serverError } from '../../helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../helpers/interfaces'
import { ILoadAccountById } from '../../helpers/interfaces/db/load-account-by-id'
import { ICompareDateByMinutes } from '../../helpers/interfaces/validators/data-fns'
import { transformeAccountModel } from '../../utils/transforme-account-model'

export class GetAccountController implements IController {
  constructor(
    private readonly loadAccountById: ILoadAccountById,
    private readonly compareDate: ICompareDateByMinutes
  ) {}

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const account = await this.loadAccountById.loadById(req.accountId)

      if (account) {
        const differenceDate = this.compareDate.compareInMinutes(
          account.ultimo_login
        )

        if (differenceDate) return ok(transformeAccountModel(account))
      }

      return forbidden(new AccessDeniedError('Sessão inválida'))
    } catch (error) {
      return serverError()
    }
  }
}
