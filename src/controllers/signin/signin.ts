import { ErrorMessage } from '../../helpers/errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation
} from '../../helpers/interfaces'
import { IAuthentication } from '../../helpers/interfaces/authentication'
import { dateToString } from '../../utils/date-to-string'

export class SignInController implements IController {
  private readonly validation: IValidation
  private readonly authentication: IAuthentication

  constructor(validation: IValidation, authentication: IAuthentication) {
    this.validation = validation
    this.authentication = authentication
  }

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFieldError = this.validation.validate(req.body)

      if (requiredFieldError) return badRequest(new ErrorMessage())

      const { email, senha } = req.body

      const authenticationAccount = await this.authentication.auth(email, senha)

      if (!authenticationAccount) return unauthorized()

      return ok({
        id: authenticationAccount.id,
        data_criacao: dateToString(authenticationAccount.data_criacao),
        data_atualizacao: dateToString(authenticationAccount.data_atualizacao),
        ultimo_login: dateToString(authenticationAccount.ultimo_login),
        token: authenticationAccount.token
      })
    } catch (error) {
      serverError()
    }
  }
}
