import { IAuthentication } from '@/helpers/interfaces'
import { BcryptAdapter } from '@/database/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/database/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/database/mongodb/account/account-mongo-repository'
import { DbAuthentication } from '@/database/account/authentication/db-authentication'

export const makeDbAuthentication = (): IAuthentication => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter('T4P-S3cret3')
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  )
}
