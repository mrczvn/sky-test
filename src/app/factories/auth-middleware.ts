import { AccountMongoRepository } from '../../database/account/account-mongo-repository'
import { DbLoadAccountByToken } from '../../database/account/db-load-account-by-token'
import { BcryptAdapter } from '../../database/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../database/criptography/jwt-adapter/jwt-adapter'
import { IMiddleware } from '../../helpers/interfaces'
import { AuthMiddleware } from '../../middlewares/auth-middleware'

export const makeAuthMiddleware = (): IMiddleware => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter('T4P-S3cret3')
  const accountMongoRepository = new AccountMongoRepository(bcryptAdapter)
  const loadAccountByToken = new DbLoadAccountByToken(
    jwtAdapter,
    accountMongoRepository
  )

  return new AuthMiddleware(loadAccountByToken)
}
