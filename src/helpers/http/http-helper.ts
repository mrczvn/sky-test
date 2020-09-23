import { IHttpResponse } from '../interfaces'

export const badRequest = (error: Error): IHttpResponse => ({
  'código de status': 400,
  mensagem: error
})
