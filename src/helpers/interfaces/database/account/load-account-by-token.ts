import { IAccount } from '../mongodb/mongo-account-repository'

export interface ILoadAccountByToken {
  load: (accessToken: string, role?: string) => Promise<IAccount>
}
