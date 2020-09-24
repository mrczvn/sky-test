import { SignInController } from '../../controllers/signin/signin'
import { IController } from '../../helpers/interfaces'
import { makeDbAuthentication } from './authentication'
import { makeSignInValidation } from './signin-validation'

export const makeSignInController = (): IController =>
  new SignInController(makeSignInValidation(), makeDbAuthentication())
