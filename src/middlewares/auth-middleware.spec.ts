import { AccessDeniedError } from '../helpers/errors/access-denied-error'
import { forbidden } from '../helpers/http'
import { IAccountModel, ILoadAccountByToken } from '../helpers/interfaces'
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

    await sut.handle({ headers: { authorization: 'Bearer any_token' } })

    expect(loadSpy).toHaveBeenCalledWith('Bearer any_token')
  })
})
