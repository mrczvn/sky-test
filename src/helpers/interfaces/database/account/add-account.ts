import { IAccountWithoutTokenRepository } from '../mongodb/mongo-add-account-repository'

export interface IAddAccountParams {
  nome: string
  email: string
  senha: string
  telefones: any
}
export interface IAddAccount {
  add: (account: IAddAccountParams) => Promise<IAccountWithoutTokenRepository>
}
