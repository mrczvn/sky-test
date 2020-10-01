import { IValidation } from '@/helpers/interfaces'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/helpers/validators'
import { EmailValidatorAdapter } from '@/app/adapters/email-validator-adapter'

export const makeSignInValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  const requiredFields = ['email', 'senha']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
