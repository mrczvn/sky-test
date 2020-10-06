import { IAccountRepository } from './mongo-account-repository'

export interface ILoadAccountByTokenRepositoryParams {
  accessToken: string
  role?: string
}

export interface ILoadAccountByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<IAccountRepository>
}
