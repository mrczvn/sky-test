import { IValidation } from '../interfaces'

export class ValidationComposite implements IValidation {
  private readonly validations: IValidation[]

  constructor(validations: IValidation[]) {
    this.validations = validations
  }

  validate(input: any): Error {
    return this.validations.reduce(
      (acc, validation) => acc || validation.validate(input),
      this.validations[0].validate(input)
    )
  }
}
