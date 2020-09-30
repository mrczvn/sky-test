import { IAccount, ILoadAccountByIdRepository } from '../../helpers/interfaces'
import { DbLoadAccountById } from './db-load-account-by-id'

interface SutTypes {
  sut: DbLoadAccountById
  loadAccountByIdStub: ILoadAccountByIdRepository
}

const makeLoadAccountById = (timestamps): ILoadAccountByIdRepository => {
  class LoadAccountByIdStub implements ILoadAccountByIdRepository {
    async loadById(id: string): Promise<IAccount> {
      return new Promise((resolve) => resolve(makeFakeAccount(timestamps)))
    }
  }
  return new LoadAccountByIdStub()
}

const makeFakeAccount = (timestamps): IAccount => ({
  id: 'any_id',
  nome: 'any_nome',
  email: 'any_email@mail.com',
  senha: 'any_hashed',
  telefones: [{ numero: 123456789, ddd: 11 }],
  data_criacao: timestamps,
  data_atualizacao: timestamps,
  ultimo_login: timestamps,
  token: 'any_token'
})

const makeSut = (timestamps = new Date()): SutTypes => {
  const loadAccountByIdStub = makeLoadAccountById(timestamps)

  const sut = new DbLoadAccountById(loadAccountByIdStub)

  return { sut, loadAccountByIdStub }
}

describe('DbLoadAccountById', () => {
  test('Should call LoadAccountByIdRepository with correct id', async () => {
    const { sut, loadAccountByIdStub } = makeSut()

    const loadByIdSpy = jest.spyOn(loadAccountByIdStub, 'loadById')

    await sut.loadById('any_id')

    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should return null if LoadAccountByIdRepository returns null', async () => {
    const { sut, loadAccountByIdStub } = makeSut()

    jest.spyOn(loadAccountByIdStub, 'loadById').mockResolvedValueOnce(null)

    const account = await sut.loadById('any_id')

    expect(account).toBe(null)
  })

  test('Should return account on success', async () => {
    const date = new Date()

    const { sut } = makeSut(date)

    const account = await sut.loadById('any_id')

    expect(account).toEqual(makeFakeAccount(date))
  })

  test('Should throw if LoadAccountByIdRepository throws', async () => {
    const { sut, loadAccountByIdStub } = makeSut()

    jest.spyOn(loadAccountByIdStub, 'loadById').mockImplementationOnce(() => {
      throw new Error()
    })

    const account = sut.loadById('any_id')

    await expect(account).rejects.toThrow()
  })
})
