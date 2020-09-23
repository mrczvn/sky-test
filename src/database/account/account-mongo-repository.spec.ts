import { IAddAccountRepository } from '../../helpers/interfaces/add-account-repository'
import { MongoHelper } from '../mongo-helper'
import { AccountMongoRepository } from './account-mongo-repository'

const makeSut = (): IAddAccountRepository => new AccountMongoRepository()

describe('Account Mongo Repository', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  test('Should return null if email in use', async () => {
    const sut = makeSut()

    const account = {
      nome: 'any_nome',
      email: 'any_email@mail.com',
      senha: 'any_senha',
      telefones: [{ numero: 123456789, ddd: 11 }]
    }

    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.insertOne(account)

    const accountData = await sut.add(account)

    expect(accountData).toBeFalsy()
  })
})
