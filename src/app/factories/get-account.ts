import { GetAccountController } from '../../controllers/account/get-account'
import { IController } from '../../helpers/interfaces'

export const makeGetAccount = (): IController => new GetAccountController()
