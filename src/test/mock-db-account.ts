import faker from 'faker'
import {
  IAccountRepository,
  ILoadAccountByEmailRepository,
  ILoadAccountByIdRepository,
  IUpdateAccessTokenRepository
} from '@/helpers/interfaces'
import { mockAccount } from './mock-account'

export const mockAuthenticationParams = (): any => ({
  email: faker.internet.email(),
  senha: faker.internet.password()
})

export const mockLoadAccountByIdParams = (): string => faker.random.uuid()

export class LoadAccountByEmailRepositorySpy
  implements ILoadAccountByEmailRepository {
  email: string
  account: IAccountRepository = mockAccount()

  async loadByEmail(email: string): Promise<IAccountRepository> {
    this.email = email

    return this.account
  }
}

export class LoadAccountByIdRepositorySpy
  implements ILoadAccountByIdRepository {
  id: string
  account: IAccountRepository = mockAccount()

  async loadById(id: string): Promise<IAccountRepository> {
    this.id = id

    return this.account
  }
}

export class UpdateAccessTokenRepositorySpy
  implements IUpdateAccessTokenRepository {
  id: string
  token: string

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id
    this.token = token
  }
}
