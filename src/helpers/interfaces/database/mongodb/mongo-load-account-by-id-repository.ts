import { IAccountRepository } from './mongo-account-repository'

export interface ILoadAccountByIdRepository {
  loadById: (id: string) => Promise<IAccountRepository>
}
