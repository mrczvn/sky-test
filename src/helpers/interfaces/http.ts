export interface IHttpResponse {
  'código de status': number
  mensagem: any
}

export interface IHttpRequest {
  body?: any
  headers?: any
}
