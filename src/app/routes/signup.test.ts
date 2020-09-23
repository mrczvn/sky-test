import request from 'supertest'
import { MongoHelper } from '../../database/mongo-helper'
import app from '../app'

describe('SignUp Routes', () => {
  beforeAll(async () => await MongoHelper.connect(process.env.MONGO_URL))

  afterAll(async () => await MongoHelper.disconnect())

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.deleteMany({})
  })

  test('Should return an account on success', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        nome: 'any_nome',
        email: 'any_email@mail.com',
        senha: 'any_senha',
        telefones: [{ numero: 123456789, ddd: 11 }]
      })
      .expect(200)
  })
})