import { ErrorMessage } from '../errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation =>
  new RequiredFieldValidation('field')

describe('RequiredField Validation', () => {
  test('Should return an ErrorMessage if validations fails', () => {
    const sut = makeSut()

    const requiredFieldError = sut.validate({ nome: 'any_nome' })

    expect(requiredFieldError).toEqual(new ErrorMessage())
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()

    const requiredFieldError = sut.validate({ field: 'any_field' })

    expect(requiredFieldError).toBeFalsy()
  })
})
