import {
  IHttpRequest,
  IHttpResponse,
  IController,
  IValidation,
  IAddAccount,
  IAuthentication
} from './signup-controller-interfaces'
import { badRequest, forbidden, ok, serverError } from '@/helpers/http'
import { ErrorMessage, EmailInUseError } from '@/helpers/errors'

export class SignUpController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addAccount: IAddAccount,
    private readonly authentication: IAuthentication
  ) {}

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFieldError = this.validation.validate(req.body)

      if (requiredFieldError) return badRequest(new ErrorMessage())

      const { nome, email, senha, telefones } = req.body

      const account = await this.addAccount.add({
        nome,
        email,
        senha,
        telefones
      })

      if (!account) return forbidden(new EmailInUseError())

      const isAuthenticatedAccount = await this.authentication.auth(
        email,
        senha
      )

      return ok(isAuthenticatedAccount)
    } catch (error) {
      return serverError()
    }
  }
}
