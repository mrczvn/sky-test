import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IValidation
} from '../../helpers/interfaces'
import { badRequest } from '../../helpers/http'
import { ErrorMessage } from '../../helpers/errors'

export class SignUpController implements IController {
  private readonly validation: IValidation

  constructor(validation: IValidation) {
    this.validation = validation
  }

  async handle(req: IHttpRequest): Promise<IHttpResponse> {
    const requiredFieldError = this.validation.validate(req.body)

    if (requiredFieldError) return badRequest(new ErrorMessage())
  }
}
