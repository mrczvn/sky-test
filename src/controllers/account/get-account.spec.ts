import { AccessDeniedError } from '../../helpers/errors/access-denied-error'
import { forbidden, ok, serverError } from '../../helpers/http'
import { IAccount, IHttpRequest } from '../../helpers/interfaces'
import { ILoadAccountById } from '../../helpers/interfaces/db/load-account-by-id'
import { ICompareDateByMinutes } from '../../helpers/interfaces/validators/data-fns'
import { transformeAccountModel } from '../../utils/transforme-account-model'
import { GetAccountController } from './get-account'

interface SutTypes {
  sut: GetAccountController
  loadAccountByIdStub: ILoadAccountById
  compareDateStub: ICompareDateByMinutes
}

const makeLoadAccountById = (): ILoadAccountById => {
  class LoadAccountByIdStub implements ILoadAccountById {
    async loadById(id: string): Promise<IAccount> {
      return new Promise((resolve) => resolve(makeFakeAccount()))
    }
  }
  return new LoadAccountByIdStub()
}

const makeCompareDate = (): ICompareDateByMinutes => {
  class CompareDateStub implements ICompareDateByMinutes {
    compareInMinutes(dateToCompare: Date, date?: Date): boolean {
      return true
    }
  }
  return new CompareDateStub()
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
  const compareDateStub = makeCompareDate()

  const sut = new GetAccountController(loadAccountByIdStub, compareDateStub)

  return { sut, loadAccountByIdStub, compareDateStub }
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

    const httpResponse = await sut.handle(makeFakeRequest(makeFakeAccount()))

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Sessão inválida'))
    )
  })

  test('Should return 500 if LoadAccountById throws', async () => {
    const { sut, loadAccountByIdStub } = makeSut()

    jest.spyOn(loadAccountByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest(makeFakeAccount()))

    expect(httpResponse).toEqual(serverError())
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest(makeFakeAccount()))

    expect(httpResponse).toEqual(ok(transformeAccountModel(makeFakeAccount())))
  })

  test('Should call CompareDate with correct values', async () => {
    const { sut, compareDateStub } = makeSut()

    const loadByIdSpy = jest.spyOn(compareDateStub, 'compareInMinutes')

    const httpRequest = makeFakeRequest(makeFakeAccount())

    await sut.handle(httpRequest)

    expect(loadByIdSpy).toHaveBeenCalledWith(httpRequest.user.ultimo_login)
  })

  test('Should return 403 if CompareDate returns false', async () => {
    const { sut, compareDateStub } = makeSut()

    jest.spyOn(compareDateStub, 'compareInMinutes').mockReturnValueOnce(false)

    const httpResponse = await sut.handle(makeFakeRequest(makeFakeAccount()))

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Sessão inválida'))
    )
  })
})
