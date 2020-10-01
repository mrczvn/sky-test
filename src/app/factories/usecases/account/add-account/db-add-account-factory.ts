import { IAddAccount } from '@/helpers/interfaces'
import { BcryptAdapter } from '@/database/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '@/database/mongodb/account/account-mongo-repository'
import { DbAddAccount } from '@/database/account/add-account/db-add-account'

export const makeDbAddAccount = (): IAddAccount => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()

  return new DbAddAccount(
    bcryptAdapter,
    accountMongoRepository,
    accountMongoRepository
  )
}
