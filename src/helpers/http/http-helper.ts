import { ErrorMessage } from '../errors'
import { IHttpResponse } from '../interfaces'

export const serverError = (): IHttpResponse => ({
  'código de status': 500,
  mensagem: new ErrorMessage()
})

export const badRequest = (error: Error): IHttpResponse => ({
  'código de status': 400,
  mensagem: error
})

export const forbidden = (error: Error): IHttpResponse => ({
  'código de status': 403,
  mensagem: error
})

export const ok = (data: any): IHttpResponse => ({
  'código de status': 200,
  mensagem: data
})
