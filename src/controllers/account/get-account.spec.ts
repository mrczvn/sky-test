import {
  IAccountModel,
  IHttpRequest,
  ILoadAccountByIdRepository
} from '../../helpers/interfaces'
import { GetAccountController } from './get-account'

interface SutTypes {
  sut: GetAccountController
  loadAccountByIdStub: ILoadAccountByIdRepository
}

const makeLoadAccountById = (timestamp): ILoadAccountByIdRepository => {
  class LoadAccountByIdStub implements ILoadAccountByIdRepository {
    async loadById(id: string): Promise<IAccountModel> {
      return makeFakeAccount(timestamp)
    }
  }
  return new LoadAccountByIdStub()
}

const makeFakeAccount = (timestamp): IAccountModel => ({
  id: 'any_id',
  nome: 'any_nome',
  email: 'any_email@mail.com',
  senha: 'any_senha',
  telefones: [{ ddd: 11, numero: 123456789 }],
  data_criacao: timestamp,
  data_atualizacao: timestamp,
  ultimo_login: timestamp,
  token: 'any_token'
})

const makeFakeRequest = (account): IHttpRequest => ({
  user: account
})

const makeSut = (timestamp = new Date()): SutTypes => {
  const loadAccountByIdStub = makeLoadAccountById(timestamp)

  const sut = new GetAccountController(loadAccountByIdStub)

  return { sut, loadAccountByIdStub }
}

describe('GetAccount Controller', () => {
  test('Should call LoadAccountById with correct id', async () => {
    const date = new Date()

    const { sut, loadAccountByIdStub } = makeSut(date)

    const loadByIdSpy = jest.spyOn(loadAccountByIdStub, 'loadById')

    const httpRequest = makeFakeRequest(makeFakeAccount(date))

    await sut.handle(httpRequest)

    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.user.id)
  })
})
