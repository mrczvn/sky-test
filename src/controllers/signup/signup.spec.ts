import { EmailInUseError, ErrorMessage } from '../../helpers/errors'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '../../helpers/http/http-helper'
import { IHttpRequest, IValidation } from '../../helpers/interfaces'
import {
  IAddAccountRepository,
  IAddAccountParams,
  IAccountModel
} from '../../helpers/interfaces/account-repository'
import { IAuthentication } from '../../helpers/interfaces/authentication'
import { transformeAccountModel } from '../../utils/transforme-account-model'
import { SignUpController } from './signup'

interface SutTypes {
  sut: SignUpController
  validationStub: IValidation
  addAccountStub: IAddAccountRepository
  authenticationStub: IAuthentication
}

const makeValidation = (): IValidation => {
  class ValidationStub implements IValidation {
    validate(input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddAccount = (timestamp): IAddAccountRepository => {
  class AddAccountStub implements IAddAccountRepository {
    async add(account: IAddAccountParams): Promise<IAccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount(timestamp)))
    }
  }

  return new AddAccountStub()
}

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(email: string, password: string): Promise<IAccountModel> {
      return null
    }
  }
  return new AuthenticationStub()
}

const makeFakeAccount = (timestamp): IAccountModel => ({
  id: 'any_id',
  nome: 'any_nome',
  email: 'any_email@mail.com',
  senha: 'any_senha',
  telefones: [{ ddd: 11, numero: 123456789 }],
  data_criacao: timestamp,
  data_atualizacao: timestamp,
  ultimo_login: timestamp,
  token: 'any_token'
})

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    nome: 'any_nome',
    email: 'any_email@mail.com',
    senha: 'any_senha',
    telefones: [{ numero: 123456789, ddd: 11 }]
  }
})

const makeSut = (timestamp = new Date()): SutTypes => {
  const validationStub = makeValidation()
  const addAccountStub = makeAddAccount(timestamp)
  const authenticationStub = makeAuthentication()

  const sut = new SignUpController(
    validationStub,
    addAccountStub,
    authenticationStub
  )

  return {
    sut,
    validationStub,
    addAccountStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new ErrorMessage())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new ErrorMessage()))
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError())
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()

    const addSpy = jest.spyOn(addAccountStub, 'add')

    await sut.handle(makeFakeRequest())

    expect(addSpy).toHaveBeenCalledWith(makeFakeRequest().body)
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = makeSut()

    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(null)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const timestamp = new Date()

    const { sut, authenticationStub } = makeSut(timestamp)

    const account = makeFakeAccount(timestamp)

    jest
      .spyOn(authenticationStub, 'auth')
      .mockResolvedValueOnce(transformeAccountModel(account))

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(ok(transformeAccountModel(account)))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authenticationSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(authenticationSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.senha
    )
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError())
  })
})
