export interface IAccountRepository {
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
