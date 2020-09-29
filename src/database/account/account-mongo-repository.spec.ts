import { IAddAccountParams } from '../../helpers/interfaces/db/account-repository'
import { IEncrypter } from '../../helpers/interfaces/db/encrypter'
import { MongoHelper } from '../mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

interface SutTypes {
  sut: AccountMongoRepository
  encrypterStub: IEncrypter
}

const makeEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'))
    }
  }
  return new EncrypterStub()
}

const makeFakeAccount = (): IAddAccountParams => ({
  nome: 'any_nome',
  email: 'any_email@mail.com',
  senha: 'any_senha',
  telefones: [{ numero: 123456789, ddd: 11 }]
})

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()

  const sut = new AccountMongoRepository(encrypterStub)

  return { sut, encrypterStub }
}

describe('Account Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  test('Should return null if email in use', async () => {
    const { sut } = makeSut()

    const account = makeFakeAccount()

    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.insertOne(account)

    const accountData = await sut.add(account)

    expect(accountData).toBeFalsy()
  })

  test('Should call Encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()

    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')

    await sut.add(makeFakeAccount())

    expect(encryptSpy).toHaveBeenCalledWith('any_senha')
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()

    jest.spyOn(encrypterStub, 'encrypt').mockImplementationOnce(() => {
      throw new Error()
    })

    const accountData = sut.add(makeFakeAccount())

    await expect(accountData).rejects.toThrow()
  })

  test('Should return an account on success', async () => {
    const { sut } = makeSut()

    const account = await sut.add(makeFakeAccount())

    expect(account).toBeTruthy()
  })
})
