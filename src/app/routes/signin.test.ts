import app from '../app'
import request from 'supertest'
import { Collection } from 'mongodb'
import { MongoHelper } from '../../database/mongo-helper'
import { hash } from 'bcrypt'

let accountCollection: Collection

describe('SignIn Route', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  describe('POST /signin', () => {
    test('Should return 200 on signin', async () => {
      const senha = await hash('123', 12)

      await accountCollection.insertOne({
        nome: 'any_nome',
        email: 'any_email@mail.com',
        senha,
        telefones: [{ numero: 123456789, ddd: 11 }]
      })
      await request(app)
        .post('/api/signin')
        .send({
          email: 'any_email@mail.com',
          senha: '123'
        })
        .expect(200)
    })

    test('Should return 401 on login', async () => {
      await request(app)
        .post('/api/signin')
        .send({
          email: 'any_email@gmail.com',
          senha: '123'
        })
        .expect(401)
    })
  })
})