import {
  IAccountWithoutToken,
  IAddAccountParams
} from '../mongodb/mongo-account-repository'

export interface IAddAccount {
  add: (account: IAddAccountParams) => Promise<IAccountWithoutToken>
}
