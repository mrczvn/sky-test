import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation
} from '../../helpers/interfaces'
import { badRequest, serverError } from '../../helpers/http'
import { ErrorMessage } from '../../helpers/errors'
import { IAddAccountRepository } from '../../helpers/interfaces/add-account-repository'

export class SignUpController implements IController {
  private readonly validation: IValidation
  private readonly addAccount: IAddAccountRepository

  constructor(validation: IValidation, addAccount: IAddAccountRepository) {
    this.validation = validation
    this.addAccount = addAccount
  }

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFieldError = this.validation.validate(req.body)

      if (requiredFieldError) return badRequest(new ErrorMessage())

      const { nome, email, senha, telefones } = req.body

      await this.addAccount.add({ nome, email, senha, telefones })
    } catch (error) {
      return serverError()
    }
  }
}
