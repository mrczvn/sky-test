import {
  IAccount,
  IAccountModel,
  IAddAccountParams,
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
  IUpdateAccessTokenRepository
} from '../../helpers/interfaces/account-repository'
import { IEncrypter } from '../../helpers/interfaces/encrypter'
import { compareDate } from '../../utils/compare-date'
import { MongoHelper } from '../mongo-helper'

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    ILoadAccountByEmailRepository,
    IUpdateAccessTokenRepository {
  private readonly encrypter: IEncrypter

  constructor(encrypter: IEncrypter) {
    this.encrypter = encrypter
  }

  async add(account: IAddAccountParams): Promise<IAccountModel> {
    const emailInUse = await this.loadByEmail(account.email)

    if (emailInUse) return null

    const hashedPassword = await this.encrypter.encrypt(account.senha)

    const accountCollection = await MongoHelper.getCollection('accounts')

    const date = new Date()

    const addAccount = await accountCollection.insertOne({
      ...account,
      senha: hashedPassword,
      data_criacao: date,
      data_atualizacao: date,
      ultimo_login: date
    })

    const [accountData] = addAccount.ops

    return MongoHelper.map(accountData)
  }

  async loadByEmail(email: string): Promise<IAccount> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ email })

    return account
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const date = new Date()

    await accountCollection.updateOne(
      {
        _id: id
      },
      {
        $set: {
          token,
          data_atualizacao: date,
          ultimo_login: date
        }
      }
    )
  }

  async loadByToken(token: string, role?: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const date = new Date()

    const account = await accountCollection.findOne({ token })

    if (account) {
      const differenceDate = compareDate(date, account.ultimo_login)

      if (differenceDate) return account
    }
    return null
  }
}
