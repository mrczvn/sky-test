import { IAccountRepository } from './mongo-account-repository'

export interface ILoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<IAccountRepository>
}
