import { ErrorMessage } from '../../helpers/errors'
import { badRequest, serverError } from '../../helpers/http'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation
} from '../../helpers/interfaces'

export class SignInController implements IController {
  private readonly validation: IValidation

  constructor(validation: IValidation) {
    this.validation = validation
  }

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    try {
      const requiredFieldError = this.validation.validate(req.body)

      if (requiredFieldError) return badRequest(new ErrorMessage())
    } catch (error) {
      serverError()
    }
  }
}
