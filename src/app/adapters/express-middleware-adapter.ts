import { NextFunction, Request, Response } from 'express'
import { IHttpRequest, IMiddleware } from '@/helpers/interfaces'

export const adaptMiddleware = (middleware: IMiddleware) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const httpRequest: IHttpRequest = { headers: req.headers }

  const httpResponse = await middleware.handle(httpRequest)

  const statusCode = httpResponse['código de status']

  const body = httpResponse.mensagem

  if (statusCode === 200) {
    Object.assign(req, body)

    next()
  } else {
    return res.status(statusCode).json({ mensagem: body })
  }
}
