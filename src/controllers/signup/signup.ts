import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation
} from '../../helpers/interfaces'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http'
import { EmailInUseError, ErrorMessage } from '../../helpers/errors'
import { IAddAccountRepository } from '../../helpers/interfaces/account-repository'
import { dateToString } from '../../utils/date-to-string'
import { IAuthentication } from '../../helpers/interfaces/authentication'

export class SignUpController implements IController {
  private readonly validation: IValidation
  private readonly addAccount: IAddAccountRepository
  private readonly authentication: IAuthentication

  constructor(
    validation: IValidation,
    addAccount: IAddAccountRepository,
    authentication: IAuthentication
  ) {
    this.validation = validation
    this.addAccount = addAccount
    this.authentication = authentication
  }

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

      const accountData = await this.authentication.auth(email, senha)

      return ok({
        id: accountData.id,
        data_criacao: dateToString(account.data_criacao),
        data_atualizacao: dateToString(account.data_atualizacao),
        ultimo_login: dateToString(account.ultimo_login),
        token: accountData.token
      })
    } catch (error) {
      return serverError()
    }
  }
}
