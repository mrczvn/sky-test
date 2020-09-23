import { ErrorMessage } from '../errors'
import { IValidation } from '../interfaces'
import { ValidationComposite } from './validation-composite'

interface SutTypes {
  sut: ValidationComposite
  validationStub: IValidation
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return new ErrorMessage()
    }
  }
  return new ValidationStub()
}

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()

  const sut = new ValidationComposite([validationStub])

  return { sut, validationStub }
}

describe('Validation Composite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 'any_field' })

    expect(error).toEqual(new ErrorMessage())
  })
})
