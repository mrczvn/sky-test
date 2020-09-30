import { GetAccountController } from '../../controllers/account/get-account'
import { AccountMongoRepository } from '../../database/account/account-mongo-repository'
import { DbLoadAccountById } from '../../database/account/db-load-account-by-id'
import { BcryptAdapter } from '../../database/criptography/bcrypt-adapter/bcrypt-adapter'
import { IController } from '../../helpers/interfaces'

export const makeGetAccountController = (): IController => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)

  const accountMongoRepository = new AccountMongoRepository(bcryptAdapter)

  const dbLoadAccountById = new DbLoadAccountById(accountMongoRepository)

  return new GetAccountController(dbLoadAccountById)
}
