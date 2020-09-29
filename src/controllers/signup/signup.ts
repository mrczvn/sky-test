import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation
} from '../../helpers/interfaces'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http'
import { EmailInUseError, ErrorMessage } from '../../helpers/errors'
import { IAddAccountRepository } from '../../helpers/interfaces/db/account-repository'
import { IAuthentication } from '../../helpers/interfaces/db/authentication'

export class SignUpController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly addAccount: IAddAccountRepository,
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
