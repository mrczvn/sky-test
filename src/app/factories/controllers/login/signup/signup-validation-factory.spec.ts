import { IEmailValidator, IValidation } from '@/helpers/interfaces'
import {
  ValidationComposite,
  RequiredFieldValidation,
  EmailValidation
} from '@/helpers/validators'
import { makeSignUpController } from './signup-factory'

jest.mock('@/helpers/validators/validation-composite')

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('SignUpController Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpController()

    const validations: IValidation[] = []

    const requiredFields = ['nome', 'email', 'senha', 'telefones']

    for (const field of requiredFields) {
      validations.push(new RequiredFieldValidation(field))
    }

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
