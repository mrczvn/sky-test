import { IAccountModel } from '../helpers/interfaces'
import { dateToString } from './date-to-string'

export const transformeAccountModel = (account): IAccountModel => ({
  id: account.id,
  nome: account.nome,
  email: account.email,
  senha: account.senha,
  telefones: account.telefones,
  data_criacao: dateToString(account.data_criacao),
  data_atualizacao: dateToString(account.data_atualizacao),
  ultimo_login: dateToString(account.ultimo_login),
  token: account.token
})
