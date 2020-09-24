export interface IAddAccountParams {
  nome: string
  email: string
  senha: string
  telefones: any
}

export interface IAccountModel {
  id: string
  data_criacao: Date
  data_atualizacao: Date
  ultimo_login: Date
  token: string
}

export interface IAccount {
  _id: string
  nome: string
  email: string
  senha: string
  telefones: any
  data_criacao: Date
  data_atualizacao: Date
  ultimo_login: Date
  token: string
}

export interface IAddAccountRepository {
  add(account: IAddAccountParams): Promise<IAccountModel>
}

export interface ILoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<IAccount>
}

export interface IUpdateAccessTokenRepository {
  updateAccessToken(id: string, token: string): Promise<void>
}
