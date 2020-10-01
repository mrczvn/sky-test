import { IMiddleware } from '@/helpers/interfaces'
import { AuthMiddleware } from '@/middlewares/auth-middleware'
import { makeDbLoadAccountByToken } from '@/app/factories/usecases/account/load-account-by-token/db-load-account-by-token-factory'

export const makeAuthMiddleware = (): IMiddleware =>
  new AuthMiddleware(makeDbLoadAccountByToken())
