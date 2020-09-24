import {
  IAccountModel,
  ILoadAccountByTokenRepository,
  ITokenDecrypter
} from '../../helpers/interfaces'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: ITokenDecrypter
  loadAccountByTokenRepositoryStub: ILoadAccountByTokenRepository
}

const makeDecrypter = (): ITokenDecrypter => {
  class DecrypterStub implements ITokenDecrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

const makeLoadAccountByTokenRepository = (
  timestamp
): ILoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub
    implements ILoadAccountByTokenRepository {
    async loadByToken(token: string, role?: string): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount(timestamp)))
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

const makeFakeAccount = (timestamp): IAccountModel => ({
  id: 'any_id',
  data_criacao: timestamp,
  data_atualizacao: timestamp,
  ultimo_login: timestamp,
  token: 'any_token'
})

const makeSut = (timestamp = new Date()): SutTypes => {
  const decrypterStub = makeDecrypter()
  const loadAccountByTokenRepositoryStub = makeLoadAccountByTokenRepository(
    timestamp
  )

  const sut = new DbLoadAccountByToken(
    decrypterStub,
    loadAccountByTokenRepositoryStub
  )

  return { sut, decrypterStub, loadAccountByTokenRepositoryStub }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token', 'any_role')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { sut, decrypterStub } = makeSut()

    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)

    const account = await sut.load('any_token', 'any_role')

    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { sut, loadAccountByTokenRepositoryStub } = makeSut()

    const loadByTokenSpy = jest.spyOn(
      loadAccountByTokenRepositoryStub,
      'loadByToken'
    )
    await sut.load('any_token', 'any_role')

    expect(loadByTokenSpy).toHaveBeenCalledWith('any_token', 'any_role')
  })
})
