import { ErrorMessage } from '../../helpers/errors'
import { badRequest, ok, unauthorized } from '../../helpers/http'
import {
  IAccountModel,
  IHttpRequest,
  IValidation
} from '../../helpers/interfaces'
import { IAuthentication } from '../../helpers/interfaces/db/authentication'
import { transformeAccountModel } from '../../utils/transforme-account-model'
import { SignInController } from './signin'

interface SutTypes {
  sut: SignInController
  validationStub: IValidation
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

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(email: string, password: string): Promise<IAccountModel> {
      return null
    }
  }
  return new AuthenticationStub()
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    nome: 'any_nome',
    email: 'any_email@mail.com',
    senha: 'any_senha',
    telefones: [{ numero: 123456789, ddd: 11 }]
  }
})

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()

  const sut = new SignInController(validationStub, authenticationStub)

  return { sut, validationStub, authenticationStub }
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

  test('Should return 401 if Authentication returns null', async () => {
    const { sut } = makeSut()

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should call Authenticaton with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const addSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(addSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.senha
    )
  })

  test('Should return 200 if account is authenticate', async () => {
    const { sut, authenticationStub } = makeSut()

    const date = new Date()

    const account = {
      id: 'any_id',
      nome: 'any_nome',
      email: 'any_email@mail.com',
      senha: 'any_senha',
      telefones: [{ ddd: 11, numero: 123456789 }],
      data_criacao: date,
      data_atualizacao: date,
      ultimo_login: date,
      token: 'any_token'
    }
    jest
      .spyOn(authenticationStub, 'auth')
      .mockResolvedValueOnce(transformeAccountModel(account))

    const httpRequest = makeFakeRequest()

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual(ok(transformeAccountModel(account)))
  })
})
