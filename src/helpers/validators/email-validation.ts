import { ErrorMessage } from '../errors'
import { IEmailValidator, IValidation } from '../interfaces'

export class EmailValidation implements IValidation {
  private readonly fieldName: string
  private readonly emailValidator: IEmailValidator

  constructor(fieldName: string, emailValidator: IEmailValidator) {
    this.fieldName = fieldName
    this.emailValidator = emailValidator
  }

  validate(input: any): Error {
    const isValidEmail = this.emailValidator.isValid(input[this.fieldName])

    if (!isValidEmail) return new ErrorMessage()
  }
}
