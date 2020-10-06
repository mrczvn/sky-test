import {
  IHttpRequest,
  AddAccountSpy,
  AuthenticationSpy,
  ValidationSpy,
  mockAddAccountParams,
  throwError
} from './signup-controller-interfaces'
import { SignUpController } from './signup-controller'
import { badRequest, forbidden, ok, serverError } from '@/helpers/http'
import { ErrorMessage, EmailInUseError } from '@/helpers/errors'

interface SutTypes {
  sut: SignUpController
  validationSpy: ValidationSpy
  addAccountSpy: AddAccountSpy
  authenticationSpy: AuthenticationSpy
}

const mockRequest = (): IHttpRequest => ({ body: mockAddAccountParams() })

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const addAccountSpy = new AddAccountSpy()
  const authenticationSpy = new AuthenticationSpy()

  const sut = new SignUpController(
    validationSpy,
    addAccountSpy,
    authenticationSpy
  )

  return { sut, validationSpy, addAccountSpy, authenticationSpy }
}

describe('SignUp Controller', () => {
  const mockFakeRequest = mockRequest()

  test('Should call Validation with correct value', async () => {
    const { sut, validationSpy } = makeSut()

    await sut.handle(mockFakeRequest)

    expect(validationSpy.input).toEqual(mockFakeRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationSpy } = makeSut()

    validationSpy.error = new Error()

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(badRequest(new ErrorMessage()))
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, validationSpy } = makeSut()

    jest.spyOn(validationSpy, 'validate').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(serverError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountSpy } = makeSut()

    await sut.handle(mockFakeRequest)

    expect(addAccountSpy.addAccountParams).toEqual(mockFakeRequest.body)
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountSpy } = makeSut()

    addAccountSpy.accountModel = null

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountSpy } = makeSut()

    jest.spyOn(addAccountSpy, 'add').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(serverError())
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    await sut.handle(mockFakeRequest)

    expect(authenticationSpy.email).toBe(mockFakeRequest.body.email)
    expect(authenticationSpy.password).toBe(mockFakeRequest.body.senha)
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()

    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(serverError())
  })

  test('Should return an account on success', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(ok(authenticationSpy.authenticatedAccount))
  })
})
