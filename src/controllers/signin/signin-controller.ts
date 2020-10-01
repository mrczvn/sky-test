import {
  IHttpRequest,
  IHttpResponse,
  IController,
  IValidation,
  IAuthentication
} from './signin-controller-interfaces'
import { badRequest, unauthorized, ok, serverError } from '@/helpers/http'
import { ErrorMessage } from '@/helpers/errors'

export class SignInController implements IController {
  constructor(
    private readonly validation: IValidation,
    private readonly authentication: IAuthentication
  ) {}

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
