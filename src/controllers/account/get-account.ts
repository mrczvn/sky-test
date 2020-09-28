import { ok, serverError } from '../../helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../helpers/interfaces'
import { transformeAccountModel } from '../../utils/transforme-account-model'

export class GetAccountController implements IController {
  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      return ok(transformeAccountModel(req.user))
    } catch (error) {
      return serverError()
    }
  }
}
