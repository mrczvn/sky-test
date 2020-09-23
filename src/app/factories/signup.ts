import { SignUpController } from '../../controllers/signup/signup'
import { AccountMongoRepository } from '../../database/account/account-mongo-repository'
import { BcryptAdapter } from '../../database/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../database/criptography/jwt-adapter/jwt-adapter'
import { IController } from '../../helpers/interfaces'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): IController => {
  const salt = 12

  const bcryptAdapter = new BcryptAdapter(salt)
  const jwtAdapter = new JwtAdapter('Top-Secret')
  const addAccount = new AccountMongoRepository(bcryptAdapter)
  const signUpController = new SignUpController(
    makeSignUpValidation(),
    addAccount,
    jwtAdapter
  )

  return signUpController
}
