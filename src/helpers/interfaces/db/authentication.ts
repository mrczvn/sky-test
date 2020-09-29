import { IAccountModel } from './account-repository'

export interface IAuthentication {
  auth(email: string, password: string): Promise<IAccountModel>
}
