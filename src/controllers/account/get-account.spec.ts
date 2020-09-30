import { AccessDeniedError } from '../../helpers/errors/access-denied-error'
import { forbidden } from '../../helpers/http'
import { IAccount, IHttpRequest } from '../../helpers/interfaces'
import { ILoadAccountById } from '../../helpers/interfaces/db/load-account-by-id'
import { GetAccountController } from './get-account'

interface SutTypes {
  sut: GetAccountController
  loadAccountByIdStub: ILoadAccountById
}

const makeLoadAccountById = (): ILoadAccountById => {
  class LoadAccountByIdStub implements ILoadAccountById {
    async loadById(id: string): Promise<IAccount> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByIdStub()
}

const makeFakeAccount = (
  creationDate = new Date('2020-09-29 12:00'),
  dataUpdate = new Date('2020-09-29 14:00')
): IAccount => ({
  id: 'any_id',
  nome: 'any_nome',
  email: 'any_email@mail.com',
  senha: 'any_senha',
  telefones: [{ ddd: 11, numero: 123456789 }],
  data_criacao: creationDate,
  data_atualizacao: dataUpdate,
  ultimo_login: dataUpdate,
  token: 'any_token'
})

const makeFakeRequest = (account: IAccount): IHttpRequest => ({ user: account })

const makeSut = (): SutTypes => {
  const loadAccountByIdStub = makeLoadAccountById()

  const sut = new GetAccountController(loadAccountByIdStub)

  return { sut, loadAccountByIdStub }
}

describe('GetAccount Controller', () => {
  test('Should call LoadAccountById with correct id', async () => {
    const { sut, loadAccountByIdStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadAccountByIdStub, 'loadById')

    const httpRequest = makeFakeRequest(makeFakeAccount())

    await sut.handle(httpRequest)

    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.user.id)
  })

  test('Should return 403 if LoadAccountById returns null', async () => {
    const { sut, loadAccountByIdStub } = makeSut()

    jest.spyOn(loadAccountByIdStub, 'loadById').mockResolvedValueOnce(null)

    const httpRequest = makeFakeRequest(makeFakeAccount())

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Sessão inválida'))
    )
  })
})
