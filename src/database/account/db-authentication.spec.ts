import {
  IAccount,
  ICompare,
  IHttpRequest,
  ILoadAccountByEmailRepository,
  ITokenEncrypter,
  IUpdateAccessTokenRepository
} from '../../helpers/interfaces'
import { MongoHelper } from '../mongo-helper'
import { DbAuthentication } from './db-authentication'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository
  hashCompareStub: ICompare
  encrypterStub: ITokenEncrypter
  updateAccessTokenRepositoryStub: IUpdateAccessTokenRepository
}

const makeloadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub
    implements ILoadAccountByEmailRepository {
    async loadByEmail(email: string): Promise<IAccount> {
      return makeFakeAccount()
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const makeHashCompare = (): ICompare => {
  class HashCompareStub implements ICompare {
    async compare(plaintext: string, digest: string): Promise<boolean> {
      return true
    }
  }
  return new HashCompareStub()
}

const makeEncrypter = (): ITokenEncrypter => {
  class EncrypterStub implements ITokenEncrypter {
    async encrypt(plaintext: string): Promise<string> {
      return 'any_token'
    }
  }
  return new EncrypterStub()
}

const makeUpdateAccessTokenRepository = (): IUpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub
    implements IUpdateAccessTokenRepository {
    async updateAccessToken(id: string, token: string): Promise<void> {}
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    nome: 'any_nome',
    email: 'any_email@mail.com',
    senha: 'any_senha',
    telefones: [{ numero: 123456789, ddd: 11 }]
  }
})

const makeFakeAccount = (timestamps = new Date()): IAccount => ({
  _id: 'any_id',
  nome: 'any_nome',
  email: 'any_email@mail.com',
  senha: 'any_hashed',
  telefones: [{ numero: 123456789, ddd: 11 }],
  data_criacao: timestamps,
  data_atualizacao: timestamps,
  ultimo_login: timestamps,
  token: 'any_token'
})

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = makeloadAccountByEmailRepository()
  const hashCompareStub = makeHashCompare()
  const encrypterStub = makeEncrypter()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    sut,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  test('Should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockResolvedValueOnce(null)

    const httpRequest = makeFakeRequest()

    const accountData = await sut.auth(
      httpRequest.body.email,
      httpRequest.body.senha
    )

    expect(accountData).toBeNull()
  })

  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    const loadByEmailSpy = jest.spyOn(
      loadAccountByEmailRepositoryStub,
      'loadByEmail'
    )

    const httpRequest = makeFakeRequest()

    await sut.auth(httpRequest.body.email, httpRequest.body.senha)

    expect(loadByEmailSpy).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const httpRequest = makeFakeRequest()

    const accountData = sut.auth(httpRequest.body.email, httpRequest.body.senha)

    await expect(accountData).rejects.toThrow()
  })
})