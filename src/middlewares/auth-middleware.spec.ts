import { AccessDeniedError } from '../helpers/errors/access-denied-error'
import { forbidden, ok, serverError } from '../helpers/http'
import {
  IAccountModel,
  IHttpRequest,
  ILoadAccountByToken
} from '../helpers/interfaces'
import { AuthMiddleware } from './auth-middleware'

interface SutTypes {
  sut: AuthMiddleware
  loadAccounByTokenStub: ILoadAccountByToken
}

const makeLoadAccountByToken = (timestamp): ILoadAccountByToken => {
  class LoadAccounByTokenStub implements ILoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount(timestamp)))
    }
  }
  return new LoadAccounByTokenStub()
}

const makeFakeRequest = (): IHttpRequest => ({
  headers: { authorization: 'Bearer any_token' }
})

const makeFakeAccount = (timestamp): IAccountModel => ({
  id: 'any_id',
  data_criacao: timestamp,
  data_atualizacao: timestamp,
  ultimo_login: timestamp,
  token: 'any_token'
})

const makeSut = (timestamp = new Date()): SutTypes => {
  const loadAccounByTokenStub = makeLoadAccountByToken(timestamp)

  const sut = new AuthMiddleware(loadAccounByTokenStub)

  return { sut, loadAccounByTokenStub }
}

describe('Auth Middleware', () => {
  test('Should return 403 if no authorization exists in headers', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Não autorizado'))
    )
  })

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccounByTokenStub } = makeSut()

    const loadSpy = jest.spyOn(loadAccounByTokenStub, 'load')

    await sut.handle(makeFakeRequest())

    expect(loadSpy).toHaveBeenCalledWith('Bearer any_token')
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { sut, loadAccounByTokenStub } = makeSut()

    jest.spyOn(loadAccounByTokenStub, 'load').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Não autorizado'))
    )
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const date = new Date()

    const { sut } = makeSut(date)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(makeFakeAccount(date)))
  })

  test('Should throw if LoadAccountByToken throws', async () => {
    const { sut, loadAccounByTokenStub } = makeSut()

    jest.spyOn(loadAccounByTokenStub, 'load').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError())
  })
})
