import {
  mockLoadAccountByIdParams,
  throwError
} from '../authentication/db-authentication-interfaces'
import { DbLoadAccountById } from './db-load-account-by-id'
import { LoadAccountByIdRepositorySpy } from './db-load-account-by-id-interfaces'

interface SutTypes {
  sut: DbLoadAccountById
  loadAccountByIdSpy: LoadAccountByIdRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByIdSpy = new LoadAccountByIdRepositorySpy()

  const sut = new DbLoadAccountById(loadAccountByIdSpy)

  return { sut, loadAccountByIdSpy }
}

describe('DbLoadAccountById', () => {
  const loadAccountByIdParams = mockLoadAccountByIdParams()

  test('Should call LoadAccountByIdRepository with correct id', async () => {
    const { sut, loadAccountByIdSpy } = makeSut()

    await sut.loadById(loadAccountByIdParams)

    expect(loadAccountByIdSpy.id).toBe(loadAccountByIdParams)
  })

  test('Should return null if LoadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdSpy } = makeSut()

    loadAccountByIdSpy.account = null

    const account = await sut.loadById(loadAccountByIdParams)

    expect(account).toBeNull()
  })

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdSpy } = makeSut()

    jest
      .spyOn(loadAccountByIdSpy, 'loadById')
      .mockImplementationOnce(throwError)

    const account = sut.loadById(loadAccountByIdParams)

    await expect(account).rejects.toThrow()
  })

  test('Should return account on success', async () => {
    const { sut, loadAccountByIdSpy } = makeSut()

    const account = await sut.loadById(loadAccountByIdParams)

    expect(account).toEqual(loadAccountByIdSpy.account)
  })
})
