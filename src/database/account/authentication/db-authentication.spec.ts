import {
  LoadAccountByEmailRepositorySpy,
  HashCompareSpy,
  EncrypterSpy,
  UpdateAccessTokenRepositorySpy,
  mockAuthenticationParams,
  throwError
} from './db-authentication-interfaces'
import { DbAuthentication } from './db-authentication'
import { transformeAccountModel } from '@/utils/transforme-account-model'

interface SutTypes {
  sut: DbAuthentication
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy
  hashCompareSpy: HashCompareSpy
  encrypterSpy: EncrypterSpy
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy
}

const makeSut = (): SutTypes => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy()
  const hashCompareSpy = new HashCompareSpy()
  const encrypterSpy = new EncrypterSpy()
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy()

  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashCompareSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  )

  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashCompareSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  }
}

describe('DbAuthentication Repository', () => {
  const { email, senha } = mockAuthenticationParams()

  test('Should call loadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    await sut.auth(email, senha)

    expect(loadAccountByEmailRepositorySpy.email).toBe(email)
  })

  test('Should return null if loadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    loadAccountByEmailRepositorySpy.account = null

    const accountData = await sut.auth(email, senha)

    expect(accountData).toBeNull()
  })

  test('Should throw if loadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut()

    jest
      .spyOn(loadAccountByEmailRepositorySpy, 'loadByEmail')
      .mockImplementationOnce(throwError)

    const accountData = sut.auth(email, senha)

    await expect(accountData).rejects.toThrow()
  })

  test('Should call HashCompare with correct values', async () => {
    const { sut, hashCompareSpy, loadAccountByEmailRepositorySpy } = makeSut()

    await sut.auth(email, senha)

    expect(hashCompareSpy.plaintext).toBe(senha)
    expect(hashCompareSpy.digest).toBe(
      loadAccountByEmailRepositorySpy.account.senha
    )
  })

  test('Should return null if HashCompare returns false', async () => {
    const { sut, hashCompareSpy } = makeSut()

    hashCompareSpy.resultComparison = false

    const accountData = await sut.auth(email, senha)

    expect(accountData).toBeNull()
  })

  test('Should throw if HashCompare throws', async () => {
    const { sut, hashCompareSpy } = makeSut()

    jest.spyOn(hashCompareSpy, 'compare').mockImplementationOnce(throwError)

    const accountData = sut.auth(email, senha)

    await expect(accountData).rejects.toThrow()
  })

  test('Should call Encrypter with correct plaintext', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()

    await sut.auth(email, senha)

    expect(encrypterSpy.plaintext).toBe(
      loadAccountByEmailRepositorySpy.account.id
    )
  })

  test('Should throw if Encrypter throws', async () => {
    const { sut, encrypterSpy } = makeSut()

    jest.spyOn(encrypterSpy, 'encrypt').mockImplementationOnce(throwError)

    const accountData = sut.auth(email, senha)

    await expect(accountData).rejects.toThrow()
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      loadAccountByEmailRepositorySpy,
      encrypterSpy,
      updateAccessTokenRepositorySpy
    } = makeSut()

    await sut.auth(email, senha)

    expect(updateAccessTokenRepositorySpy.id).toBe(
      loadAccountByEmailRepositorySpy.account.id
    )
    expect(updateAccessTokenRepositorySpy.token).toBe(encrypterSpy.accessToken)
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositorySpy } = makeSut()

    jest
      .spyOn(updateAccessTokenRepositorySpy, 'updateAccessToken')
      .mockImplementationOnce(throwError)

    const accountData = sut.auth(email, senha)

    await expect(accountData).rejects.toThrow()
  })

  test('Should return an AuthenticationModel on success', async () => {
    const { sut, encrypterSpy, loadAccountByEmailRepositorySpy } = makeSut()

    const account = await sut.auth(email, senha)

    expect(account).toEqual(
      transformeAccountModel({
        ...loadAccountByEmailRepositorySpy.account,
        token: encrypterSpy.accessToken
      })
    )
  })
})
