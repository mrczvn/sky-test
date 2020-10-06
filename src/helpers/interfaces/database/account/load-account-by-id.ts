import { IAccountRepository } from '../mongodb/mongo-account-repository'

export interface ILoadAccountById {
  loadById: (id: string) => Promise<IAccountRepository>
}
