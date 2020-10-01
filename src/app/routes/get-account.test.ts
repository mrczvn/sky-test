import request from 'supertest'
import { sign } from 'jsonwebtoken'
import { Collection } from 'mongodb'
import { MongoHelper } from '@/database/mongodb/helpers/mongo-helper'
import app from '../app'

let accountCollection: Collection

const mockAccessToken = async (): Promise<string> => {
  const date = new Date()

  const AccountCollection = await MongoHelper.getCollection('accounts')

  const account = {
    nome: 'any_nome',
    email: 'any_email@mail.com',
    senha: '123',
    telefones: [{ numero: 123456789, ddd: 11 }]
  }

  const res = await AccountCollection.insertOne({
    ...account,
    data_criacao: date,
    data_atualizacao: date,
    ultimo_login: date
  })

  const id = res.ops[0]._id

  const accessToken = sign({ id }, 'T4P-S3cret3')

  const newDate = new Date('2018-10-11 12:30')

  await AccountCollection.updateOne(
    { _id: id },
    {
      $set: {
        token: accessToken,
        data_atualizacao: newDate,
        ultimo_login: newDate
      }
    }
  )

  return accessToken
}

describe('SignIn Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  test('Should return 200 on account with valid accessToken', async () => {
    const accessToken = await mockAccessToken()

    await request(app)
      .get('/api/account')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200)
  })
})
