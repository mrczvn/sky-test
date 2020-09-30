import { IAccount } from './account-repository'

export interface ILoadAccountById {
  loadById: (id: string) => Promise<IAccount>
}
