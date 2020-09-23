import {
  IController,
  IHttpRequest,
  IHttpResponse,
  ITokenEncrypter,
  IValidation
} from '../../helpers/interfaces'
import { badRequest, forbidden, ok, serverError } from '../../helpers/http'
import { EmailInUseError, ErrorMessage } from '../../helpers/errors'
import { IAddAccountRepository } from '../../helpers/interfaces/add-account-repository'

export class SignUpController implements IController {
  private readonly validation: IValidation
  private readonly addAccount: IAddAccountRepository
  private readonly tokenGenerator: ITokenEncrypter

  constructor(
    validation: IValidation,
    addAccount: IAddAccountRepository,
    tokenGenerator: ITokenEncrypter
  ) {
    this.validation = validation
    this.addAccount = addAccount
    this.tokenGenerator = tokenGenerator
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

      await this.tokenGenerator.encrypt(account.id)

      return ok(account)
    } catch (error) {
      return serverError()
    }
  }
}
