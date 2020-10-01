import { IEmailValidator, IValidation } from '@/helpers/interfaces'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/helpers/validators'
import { makeSignInValidation } from './signin-validation-factory'

jest.mock('@/helpers/validators/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignInController Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignInValidation()

    const validations: IValidation[] = []

    const requiredFields = ['email', 'senha']

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
