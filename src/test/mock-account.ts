import faker from 'faker'
import {
  IAccountModel,
  IAccountRepository,
  IAddAccount,
  IAddAccountParams,
  IAuthentication,
  ICompareDateByMinutes,
  ILoadAccountById,
  ILoadAccountByToken,
  IValidation,
  IAccountWithoutTokenRepository
} from '@/helpers/interfaces'
import { transformeAccountModel } from '@/utils/transforme-account-model'

export const mockAddAccountParams = (): IAddAccountParams => ({
  nome: faker.name.findName(),
  email: faker.internet.email(),
  senha: faker.internet.password(),
  telefones: [
    { ddd: faker.random.number(), numero: faker.phone.phoneNumberFormat() }
  ]
})

export const mockAccount = (
  creationDate = new Date('2020-09-29 12:00'),
  dataUpdate = new Date('2020-09-29 12:00')
): IAccountRepository => ({
  id: faker.random.uuid(),
  nome: faker.name.findName(),
  email: faker.internet.email(),
  senha: faker.internet.password(),
  telefones: [
    { ddd: faker.random.number(), numero: faker.phone.phoneNumberFormat() }
  ],
  data_criacao: creationDate,
  data_atualizacao: dataUpdate,
  ultimo_login: dataUpdate,
  token: faker.random.uuid()
})

export class ValidationSpy implements IValidation {
  input: any
  error: Error = null

  validate(input: any): Error {
    this.input = input

    return this.error
  }
}

export class AddAccountSpy implements IAddAccount {
  addAccountParams: IAddAccountParams
  accountModel: IAccountRepository = mockAccount()

  async add(
    account: IAddAccountParams
  ): Promise<IAccountWithoutTokenRepository> {
    this.addAccountParams = account

    return this.accountModel
  }
}

export class AuthenticationSpy implements IAuthentication {
  email: string
  password: string
  authenticatedAccount: IAccountModel = transformeAccountModel(mockAccount())

  async auth(email: string, password: string): Promise<IAccountModel> {
    this.email = email
    this.password = password

    return this.authenticatedAccount
  }
}

export class LoadAccountByIdSpy implements ILoadAccountById {
  id: string
  account: IAccountRepository = mockAccount()

  async loadById(id: string): Promise<IAccountRepository> {
    this.id = id

    return this.account
  }
}

export class LoadAccounByTokenSpy implements ILoadAccountByToken {
  accessToken: string
  account: IAccountRepository = mockAccount()

  async load(accessToken: string, role?: string): Promise<IAccountRepository> {
    this.accessToken = accessToken

    return this.account
  }
}

export class CompareDateSpy implements ICompareDateByMinutes {
  dateToCompare: Date
  date: Date = new Date()
  resultComparison: boolean = true

  compareInMinutes(dateToCompare: Date, date?: Date): boolean {
    this.dateToCompare = dateToCompare

    return this.resultComparison
  }
}
