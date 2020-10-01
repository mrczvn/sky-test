import { GetAccountController } from '@/controllers/account/get-account-controller'
import { IController } from '@/helpers/interfaces'
import { DataFns } from '@/helpers/validators'
import { makeDbLoadAccountById } from '@/app/factories/usecases/account/load-account-by-id/db-load-account-by-id'

export const makeGetAccountController = (): IController => {
  const compareDate = new DataFns()

  return new GetAccountController(makeDbLoadAccountById(), compareDate)
}
