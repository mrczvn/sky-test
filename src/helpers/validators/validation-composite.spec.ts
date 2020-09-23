import { ErrorMessage } from '../errors'
import { IValidation } from '../interfaces'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStubs: IValidation[]
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStubs = [makeValidation(), makeValidation()]

  const sut = new ValidationComposite(validationStubs)

  return { sut, validationStubs }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValueOnce(new ErrorMessage())

    const error = sut.validate({ field: 'any_field' })

    expect(error).toEqual(new ErrorMessage())
  })

  test('Should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut()

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error())
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new ErrorMessage())

    const error = sut.validate({ field: 'any_field' })

    expect(error).toEqual(new Error())
  })

  test('Should not return if validation succeeds', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_field' })

    expect(error).toBeFalsy()
  })
})
