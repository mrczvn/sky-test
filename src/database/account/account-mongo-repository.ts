import { ObjectId } from 'mongodb'
import {
  IAccount,
  IAddAccountParams,
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
  ILoadAccountByIdRepository,
  IUpdateAccessTokenRepository
} from '../../helpers/interfaces/db/account-repository'
import { IEncrypter } from '../../helpers/interfaces/db/encrypter'
import { MongoHelper } from '../mongo-helper'

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    ILoadAccountByEmailRepository,
    IUpdateAccessTokenRepository,
    ILoadAccountByIdRepository {
  constructor(private readonly encrypter: IEncrypter) {}

  async add(account: IAddAccountParams): Promise<IAccount> {
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

    return account ? MongoHelper.map(account) : account
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

  async loadByToken(token: string, role?: string): Promise<IAccount> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ token })

    return account ? MongoHelper.map(account) : account
  }

  async loadById(id: string): Promise<IAccount> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ _id: new ObjectId(id) })

    return account ? MongoHelper.map(account) : account
  }
}
