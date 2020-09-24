import { IValidation } from '../../helpers/interfaces'
import { EmailValidation } from '../../helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../helpers/validators/required-field-validation'
import { ValidationComposite } from '../../helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../adapters/email-validator-adapter'

export const makeSignInValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  const requiredFields = ['email', 'senha']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
