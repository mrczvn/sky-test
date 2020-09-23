import { IEmailValidator, IValidation } from '../../helpers/interfaces'
import { EmailValidation } from '../../helpers/validators/email-validation'
import { RequiredFieldValidation } from '../../helpers/validators/required-field-validation'
import { ValidationComposite } from '../../helpers/validators/validation-composite'
import { makeSignUpController } from './signup'

jest.mock('../../helpers/validators/validation-composite')

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
