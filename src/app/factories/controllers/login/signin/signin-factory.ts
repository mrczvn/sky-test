import { SignInController } from '@/controllers/signin/signin-controller'
import { IController } from '@/helpers/interfaces'
import { makeDbAuthentication } from '@/app/factories/usecases/account/authentication/db-authentication-factory'
import { makeSignInValidation } from './signin-validation-factory'

export const makeSignInController = (): IController =>
  new SignInController(makeSignInValidation(), makeDbAuthentication())
