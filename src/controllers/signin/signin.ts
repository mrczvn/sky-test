import { ErrorMessage } from '../../helpers/errors'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation
} from '../../helpers/interfaces'
import { IAuthentication } from '../../helpers/interfaces/authentication'

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

      const isAuthenticatedAccount = await this.authentication.auth(
        email,
        senha
      )

      if (!isAuthenticatedAccount) return unauthorized()

      return ok(isAuthenticatedAccount)
    } catch (error) {
      return serverError()
    }
  }
}
