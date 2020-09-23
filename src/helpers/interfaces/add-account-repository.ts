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

export interface IAddAccountRepository {
  add(account: IAddAccountParams): Promise<IAccountModel>
}
