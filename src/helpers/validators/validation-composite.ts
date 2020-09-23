import { IValidation } from '../interfaces'

export class ValidationComposite implements IValidation {
  private readonly validations: IValidation[]

  constructor(validations: IValidation[]) {
    this.validations = validations
  }

  validate(input: any): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input)

      if (error) return error
    }
  }
}
