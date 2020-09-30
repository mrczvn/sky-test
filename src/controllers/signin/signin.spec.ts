import { ErrorMessage } from '../../helpers/errors'
import { badRequest, serverError, unauthorized } from '../../helpers/http'
import {
  IAccount,
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
      return transformeAccountModel(makeFakeAccount())
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

const makeFakeAccount = (
  creationDate = new Date('2020-09-29 12:00'),
  dataUpdate = new Date('2020-09-29 12:00')
): IAccount => ({
  id: 'any_id',
  nome: 'any_nome',
  email: 'any_email@mail.com',
  senha: 'any_senha',
  telefones: [{ ddd: 11, numero: 123456789 }],
  data_criacao: creationDate,
  data_atualizacao: dataUpdate,
  ultimo_login: dataUpdate,
  token: 'any_token'
})

const makeSut = (): SutTypes => {
  const validationStub = makeValidation()
  const authenticationStub = makeAuthentication()

  const sut = new SignInController(validationStub, authenticationStub)

  return { sut, validationStub, authenticationStub }
}

describe('SignUp Controller', () => {
  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = makeSut()

    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(badRequest(new ErrorMessage()))
  })

  test('Should return 500 if Validation throws', async () => {
    const { sut, validationStub } = makeSut()

    jest.spyOn(validationStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(serverError())
  })

  test('Should call Authenticaton with correct values', async () => {
    const { sut, authenticationStub } = makeSut()

    const authSpy = jest.spyOn(authenticationStub, 'auth')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(authSpy).toHaveBeenCalledWith(
      httpRequest.body.email,
      httpRequest.body.senha
    )
  })

  test('Should return 401 if Authentication returns null', async () => {
    const { sut, authenticationStub } = makeSut()

    jest.spyOn(authenticationStub, 'auth').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(unauthorized())
  })
})
