import { AccountMongoRepository } from '../../database/account/account-mongo-repository'
import { BcryptAdapter } from '../../database/criptography/bcrypt-adapter/bcrypt-adapter'

export const makeDbAddAccount = (): AccountMongoRepository => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)

  return new AccountMongoRepository(bcryptAdapter)
}
