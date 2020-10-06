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

export interface IAuthentication {
  auth: (email: string, password: string) => Promise<IAccountModel>
}
