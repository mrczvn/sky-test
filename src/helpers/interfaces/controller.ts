import { IHttpRequest, IHttpResponse } from './index'

export interface IController {
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse>
}
