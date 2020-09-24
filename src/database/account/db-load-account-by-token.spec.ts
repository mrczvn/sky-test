import { ITokenDecrypter } from '../../helpers/interfaces'
import { DbLoadAccountByToken } from './db-load-account-by-token'

interface SutTypes {
  sut: DbLoadAccountByToken
  decrypterStub: ITokenDecrypter
}

const makeDecrypter = (): ITokenDecrypter => {
  class DecrypterStub implements ITokenDecrypter {
    async decrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

const makeSut = (): SutTypes => {
  const decrypterStub = makeDecrypter()

  const sut = new DbLoadAccountByToken(decrypterStub)

  return { sut, decrypterStub }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decrypterStub } = makeSut()

    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')

    await sut.load('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
