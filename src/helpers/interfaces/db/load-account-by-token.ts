import { IAccount } from './account-repository'

export interface ILoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<IAccount>
}
