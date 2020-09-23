import validator from 'validator'
import { EmailValidatorAdapter } from './email-validator-adapter'

jest.spyOn(validator, 'isEmail').mockReturnValue(true)

const makeSut = (): EmailValidatorAdapter => new EmailValidatorAdapter()

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = makeSut()

    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValidEmail = sut.isValid('invalid_email@mail.com')

    expect(isValidEmail).toBe(false)
  })

  test('Should return true if validator returns true', () => {
    const sut = makeSut()

    const isValidEmail = sut.isValid('valid_email@mail.com')

    expect(isValidEmail).toBe(true)
  })

  test('Should call validator with correct email', () => {
    const sut = makeSut()

    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
