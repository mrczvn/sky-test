import { SignUpController } from '../../controllers/signup/signup'
import { AccountMongoRepository } from '../../database/account/account-mongo-repository'
import { BcryptAdapter } from '../../database/criptography/bcrypt-adapter/bcrypt-adapter'
import { IController } from '../../helpers/interfaces'
import { makeDbAuthentication } from './authentication'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): IController => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const addAccount = new AccountMongoRepository(bcryptAdapter)

  return new SignUpController(
    makeSignUpValidation(),
    addAccount,
    makeDbAuthentication()
  )
}
