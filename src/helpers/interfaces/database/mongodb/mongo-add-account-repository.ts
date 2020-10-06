export interface IAddAccountParamsRepository {
  nome: string
  email: string
  senha: string
  telefones: any
  data_criacao: Date
  data_atualizacao: Date
  ultimo_login: Date
}

export interface IAccountWithoutTokenRepository {
  id: string
  nome: string
  email: string
  senha: string
  telefones: any
  data_criacao: Date
  data_atualizacao: Date
  ultimo_login: Date
}

export interface IAddAccountRepository {
  add: (
    data: IAddAccountParamsRepository
  ) => Promise<IAccountWithoutTokenRepository>
}
