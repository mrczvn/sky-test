import { IValidation } from '@/helpers/interfaces'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/helpers/validators'
import { EmailValidatorAdapter } from '@/app/adapters/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: IValidation[] = []
  const requiredFields = ['nome', 'email', 'senha', 'telefones']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}
