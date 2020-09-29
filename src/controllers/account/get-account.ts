import { ok, serverError } from '../../helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  ILoadAccountByIdRepository
} from '../../helpers/interfaces'
import { transformeAccountModel } from '../../utils/transforme-account-model'

export class GetAccountController implements IController {
  constructor(private readonly loadAccountById: ILoadAccountByIdRepository) {}

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      await this.loadAccountById.loadById(req.user.id)

      return ok(transformeAccountModel(req.user))
    } catch (error) {
      return serverError()
    }
  }
}
