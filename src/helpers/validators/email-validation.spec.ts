import { ErrorMessage } from '../errors'
import { IEmailValidator } from '../interfaces'
import { EmailValidation } from './email-validation'

interface SutTypes {
  sut: EmailValidation
  emailValidatorStub: IEmailValidator
}

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeFakeEmail = (): any => ({ email: 'any_email@mail.com' })

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator()

  const sut = new EmailValidation('email', emailValidatorStub)

  return { sut, emailValidatorStub }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)

    const isValidEmail = sut.validate(makeFakeEmail())

    expect(isValidEmail).toEqual(new ErrorMessage())
  })
})
