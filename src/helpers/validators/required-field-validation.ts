import { IValidation } from '../interfaces'
import { ErrorMessage } from '../errors'

export class RequiredFieldValidation implements IValidation {
  private readonly fieldName: string

  constructor(fieldName: string) {
    this.fieldName = fieldName
  }

  validate(input: any): Error {
    if (!input[this.fieldName]) return new ErrorMessage()
  }
}
