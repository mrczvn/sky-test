import { ILoadAccountById } from '@/helpers/interfaces'
import { AccountMongoRepository } from '@/database/mongodb/account/account-mongo-repository'
import { DbLoadAccountById } from '@/database/account/load-account-by-id/db-load-account-by-id'

export const makeDbLoadAccountById = (): ILoadAccountById => {
  const accountMongoRepository = new AccountMongoRepository()

  return new DbLoadAccountById(accountMongoRepository)
}
