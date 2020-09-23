import {
  IAccountModel,
  IAddAccountParams,
  IAddAccountRepository,
  ILoadAccountByEmailRepository
} from '../../helpers/interfaces/add-account-repository'
import { MongoHelper } from '../mongo-helper'

export class AccountMongoRepository
  implements IAddAccountRepository, ILoadAccountByEmailRepository {
  async add(account: IAddAccountParams): Promise<IAccountModel> {
    const emailInUse = await this.loadByEmail(account.email)

    if (emailInUse) return null
  }

  async loadByEmail(email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    return account
  }
}
