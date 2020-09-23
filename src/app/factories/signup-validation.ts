import { IValidation } from '../../helpers/interfaces'
import { EmailValidation } from '../../helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../helpers/validators/required-field-validation'
import { ValidationComposite } from '../../helpers/validators/validation-composite'
import { EmailValidatorAdapter } from '../adapters/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  const requiredFields = ['nome', 'email', 'senha', 'telefones']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
