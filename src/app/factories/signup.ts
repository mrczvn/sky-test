import { SignUpController } from '../../controllers/signup/signup'
import { IController } from '../../helpers/interfaces'
import { makeDbAuthentication } from './authentication'
import { makeDbAddAccount } from './db-add-account'
import { makeSignUpValidation } from './signup-validation'

export const makeSignUpController = (): IController =>
  new SignUpController(
    makeSignUpValidation(),
    makeDbAddAccount(),
    makeDbAuthentication()
  )
