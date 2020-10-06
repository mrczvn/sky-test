import {
  IHttpRequest,
  AuthenticationSpy,
  ValidationSpy,
  throwError
} from './signin-controller-interfaces'
import { SignInController } from './signin-controller'
import { badRequest, unauthorized, ok, serverError } from '@/helpers/http'
import { ErrorMessage } from '@/helpers/errors'
import faker from 'faker'

interface SutTypes {
  sut: SignInController
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
}

const mockRequest = (): IHttpRequest => ({
  body: { email: faker.internet.email(), senha: faker.internet.password() }
})

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  const sut = new SignInController(validationSpy, authenticationSpy)

  return { sut, validationSpy, authenticationSpy }
}

describe('SignUp Controller', () => {
  const mockFakeRequest = mockRequest()

  test('Should call Validation with correct values', async () => {
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

  test('Should call Authenticaton with correct values', async () => {
    const { sut, authenticationSpy } = makeSut()

    await sut.handle(mockFakeRequest)

    expect(authenticationSpy.email).toBe(mockFakeRequest.body.email)
    expect(authenticationSpy.password).toBe(mockFakeRequest.body.senha)
  })

  test('Should return 401 if Authentication returns null', async () => {
    const { sut, authenticationSpy } = makeSut()

    authenticationSpy.authenticatedAccount = null

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationSpy } = makeSut()

    jest.spyOn(authenticationSpy, 'auth').mockImplementationOnce(throwError)

    const httpRequest = await sut.handle(mockFakeRequest)

    expect(httpRequest).toEqual(serverError())
  })

  test('Should return an account on success', async () => {
    const { sut, authenticationSpy } = makeSut()

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(ok(authenticationSpy.authenticatedAccount))
  })
})
