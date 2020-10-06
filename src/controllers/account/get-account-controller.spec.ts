import {
  IHttpRequest,
  CompareDateSpy,
  LoadAccountByIdSpy,
  mockAccount,
  throwError
} from './get-account-controller-interfaces'
import { GetAccountController } from './get-account-controller'
import { forbidden, ok, serverError } from '@/helpers/http'
import { AccessDeniedError } from '@/helpers/errors/access-denied-error'
import { transformeAccountModel } from '@/utils/transforme-account-model'

interface SutTypes {
  sut: GetAccountController
  loadAccountByIdSpy: LoadAccountByIdSpy
  compareDateSpy: CompareDateSpy
}

const mockRequest = (): IHttpRequest => ({ accountId: mockAccount().id })

const makeRequest = mockRequest()

const makeSut = (): SutTypes => {
  const loadAccountByIdSpy = new LoadAccountByIdSpy()
  const compareDateSpy = new CompareDateSpy()

  const sut = new GetAccountController(loadAccountByIdSpy, compareDateSpy)

  return { sut, loadAccountByIdSpy, compareDateSpy }
}

describe('GetAccount Controller', () => {
  test('Should call LoadAccountById with correct id', async () => {
    const { sut, loadAccountByIdSpy } = makeSut()

    await sut.handle(makeRequest)

    expect(loadAccountByIdSpy.id).toBe(makeRequest.accountId)
  })

  test('Should return 403 if LoadAccountById returns null', async () => {
    const { sut, loadAccountByIdSpy } = makeSut()

    loadAccountByIdSpy.account = null

    const httpResponse = await sut.handle(makeRequest)

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Sessão inválida'))
    )
  })

  test('Should return 500 if LoadAccountById throws', async () => {
    const { sut, loadAccountByIdSpy } = makeSut()

    jest
      .spyOn(loadAccountByIdSpy, 'loadById')
      .mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(makeRequest)

    expect(httpResponse).toEqual(serverError())
  })

  test('Should call CompareDate with correct values', async () => {
    const { sut, loadAccountByIdSpy, compareDateSpy } = makeSut()

    await sut.handle(makeRequest)

    expect(loadAccountByIdSpy.account.ultimo_login).toBe(
      compareDateSpy.dateToCompare
    )
  })

  test('Should return 403 if CompareDate returns false', async () => {
    const { sut, compareDateSpy } = makeSut()

    compareDateSpy.resultComparison = false

    const httpResponse = await sut.handle(makeRequest)

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Sessão inválida'))
    )
  })

  test('Should return 500 if CompareDate throws', async () => {
    const { sut, compareDateSpy } = makeSut()

    jest
      .spyOn(compareDateSpy, 'compareInMinutes')
      .mockImplementationOnce(throwError)

    const httpResponse = await sut.handle(makeRequest)

    expect(httpResponse).toEqual(serverError())
  })

  test('Should return an account on success', async () => {
    const { sut, loadAccountByIdSpy } = makeSut()

    const httpResponse = await sut.handle(makeRequest)

    expect(httpResponse).toEqual(
      ok(transformeAccountModel(loadAccountByIdSpy.account))
    )
  })
})
