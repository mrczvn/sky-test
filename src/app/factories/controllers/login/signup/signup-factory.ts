import { IController } from '@/helpers/interfaces'
import { SignUpController } from '@/controllers/signup/signup-controller'
import { makeSignUpValidation } from './signup-validation-factory'
import { makeDbAddAccount } from '@/app/factories/usecases/account/add-account/db-add-account-factory'
import { makeDbAuthentication } from '@/app/factories/usecases/account/authentication/db-authentication-factory'

export const makeSignUpController = (): IController =>
  new SignUpController(
    makeSignUpValidation(),
    makeDbAddAccount(),
    makeDbAuthentication()
  )
