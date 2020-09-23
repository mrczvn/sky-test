import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

interface SutTypes {
  sut: BcryptAdapter
  salt: number
}

jest
  .spyOn(bcrypt, 'hash')
  .mockReturnValue(new Promise((resolve) => resolve('hash')))

const makeSut = (): SutTypes => {
  const salt = 12

  const sut = new BcryptAdapter(salt)

  return { sut, salt }
}

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct values', async () => {
    const { sut, salt } = makeSut()

    const hashSpy = jest.spyOn(bcrypt, 'hash')

    await sut.encrypt('any_value')

    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
