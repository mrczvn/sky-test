import { IAccountModel } from '../mongodb/mongo-account-repository'

export interface IAuthentication {
  auth: (email: string, password: string) => Promise<IAccountModel>
}
