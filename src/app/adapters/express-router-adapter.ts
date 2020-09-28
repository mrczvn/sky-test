import { Request, Response } from 'express'
import { IController, IHttpRequest } from '../../helpers/interfaces'

export const adaptRoute = (controller: IController) => async (
  req: Request,
  res: Response
) => {
  const httpRequest: IHttpRequest = { body: req.body }

  const httpResponse = await controller.handle(httpRequest)

  const statusCode = httpResponse['código de status']

  const body = httpResponse.mensagem

  if (statusCode >= 200 && statusCode <= 299) {
    return res.status(statusCode).json(body)
  }

  return res.status(statusCode).json({ mensagem: body.name })
}
