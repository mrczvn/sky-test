import { IHttpRequest } from './auth-middleware-interfaces'
import { AuthMiddleware } from './auth-middleware'
import { forbidden, ok, serverError } from '@/helpers/http'
import { AccessDeniedError } from '@/helpers/errors'
import { LoadAccounByTokenSpy, throwError } from '@/test'

interface SutTypes {
  sut: AuthMiddleware
  loadAccounByTokenSpy: LoadAccounByTokenSpy
}

const mockRequest = (): IHttpRequest => ({
  headers: { authorization: 'Bearer any_token' }
})

const makeSut = (): SutTypes => {
  const loadAccounByTokenSpy = new LoadAccounByTokenSpy()

  const sut = new AuthMiddleware(loadAccounByTokenSpy)

  return { sut, loadAccounByTokenSpy }
}

describe('Auth Middleware', () => {
  const mockFakeRequest = mockRequest()

  test('Should return 403 if no authorization exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Não autorizado'))
    )
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccounByTokenSpy } = makeSut()

    await sut.handle(mockFakeRequest)

    const [, token] = mockFakeRequest.headers.authorization.split(' ')

    expect(loadAccounByTokenSpy.accessToken).toBe(token)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccounByTokenSpy } = makeSut()

    loadAccounByTokenSpy.account = null

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Não autorizado'))
    )
  })

  test('Should throw if LoadAccountByToken throws', async () => {
    const { sut, loadAccounByTokenSpy } = makeSut()

    jest.spyOn(loadAccounByTokenSpy, 'load').mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(serverError())
  })

  test('Should return an accountId on success', async () => {
    const { sut, loadAccounByTokenSpy } = makeSut()

    const httpResponse = await sut.handle(mockFakeRequest)

    expect(httpResponse).toEqual(
      ok({ accountId: loadAccounByTokenSpy.account.id })
    )
  })
})
