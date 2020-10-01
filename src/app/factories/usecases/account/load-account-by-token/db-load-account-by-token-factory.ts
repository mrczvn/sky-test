import { ILoadAccountByToken } from '@/helpers/interfaces'
import { JwtAdapter } from '@/database/criptography/jwt-adapter/jwt-adapter'
import { AccountMongoRepository } from '@/database/mongodb/account/account-mongo-repository'
import { DbLoadAccountByToken } from '@/database/account/load-account-by-token/db-load-account-by-token'

export const makeDbLoadAccountByToken = (): ILoadAccountByToken => {
  const jwtAdapter = new JwtAdapter('T4P-S3cret3')
  const accountMongoRepository = new AccountMongoRepository()

  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository)
}
