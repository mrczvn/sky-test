import { ObjectId } from 'mongodb'
import {
  IAccount,
  IAccountWithoutToken,
  IAddAccountParamsRepository,
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
  ILoadAccountByIdRepository,
  IUpdateAccessTokenRepository
} from './account-mongo-repository-interfaces'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    ILoadAccountByEmailRepository,
    IUpdateAccessTokenRepository,
    ILoadAccountByIdRepository {
  async add(data: IAddAccountParamsRepository): Promise<IAccountWithoutToken> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.insertOne(data)

    return MongoHelper.map(account.ops[0])
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
