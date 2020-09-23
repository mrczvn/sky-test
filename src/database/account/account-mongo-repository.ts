import {
  IAccountModel,
  IAddAccountParams,
  IAddAccountRepository,
  ILoadAccountByEmailRepository
} from '../../helpers/interfaces/add-account-repository'
import { IEncrypter } from '../../helpers/interfaces/encrypter'
import { MongoHelper } from '../mongo-helper'

export class AccountMongoRepository
  implements IAddAccountRepository, ILoadAccountByEmailRepository {
  private readonly encrypter: IEncrypter

  constructor(encrypter: IEncrypter) {
    this.encrypter = encrypter
  }

  async add(account: IAddAccountParams): Promise<IAccountModel> {
    const emailInUse = await this.loadByEmail(account.email)

    if (emailInUse) return null

    await this.encrypter.encrypt(account.senha)
  }

  async loadByEmail(email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    return account
  }
}
