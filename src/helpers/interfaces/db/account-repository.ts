export interface IAddAccountParams {
  nome: string
  email: string
  senha: string
  telefones: any
}

export interface IAccount {
  id: string
  nome: string
  email: string
  senha: string
  telefones: any
  data_criacao: Date
  data_atualizacao: Date
  ultimo_login: Date
  token: string
}

export interface IAccountModel {
  id: string
  nome: string
  email: string
  senha: string
  telefones: any
  data_criacao: string
  data_atualizacao: string
  ultimo_login: string
  token: string
}

export interface IAddAccountRepository {
  add: (account: IAddAccountParams) => Promise<IAccount>
}

export interface ILoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<IAccount>
}

export interface IUpdateAccessTokenRepository {
  updateAccessToken: (id: string, token: string) => Promise<void>
}

export interface ILoadAccountByTokenRepository {
  loadByToken: (token: string, role?: string) => Promise<IAccount>
}

export interface ILoadAccountByIdRepository {
  loadById: (id: string) => Promise<IAccount>
}
