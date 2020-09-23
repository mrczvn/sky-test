import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token'
  },

  async verify(): Promise<string> {
    return 'any_value'
  }
}))

const makeSut = (): JwtAdapter => new JwtAdapter('secret')

describe('Jwt Adapter', () => {
  test('Should call sign with correct values', async () => {
    const sut = makeSut()

    const signSpy = jest.spyOn(jwt, 'sign')

    await sut.encrypt('any_id')

    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
  })
})
