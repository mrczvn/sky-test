import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => await sut.connect(process.env.MONGO_URL))

  afterAll(async () => await sut.disconnect())

  test('Should reconnect if mongodb is down', async () => {
    await sut.disconnect()

    expect(sut.client).toBeFalsy()

    const accountCollection = await sut.getCollection('accounts')

    expect(accountCollection).toBeTruthy()
  })
})
