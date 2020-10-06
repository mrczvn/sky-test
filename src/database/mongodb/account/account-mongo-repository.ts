import { ObjectId } from 'mongodb'
import {} from './account-mongo-repository-interfaces'
import { MongoHelper } from '../helpers/mongo-helper'
import { IAccountRepository } from '@/helpers/interfaces'
import {
  IAccountWithoutTokenRepository,
  IAddAccountParamsRepository,
  IAddAccountRepository
} from '@/helpers/interfaces/database/mongodb/mongo-add-account-repository'
import { ILoadAccountByEmailRepository } from '@/helpers/interfaces/database/mongodb/mongo-load-account-by-email-repository'
import { IUpdateAccessTokenRepository } from '@/helpers/interfaces/database/mongodb/mongo-update-access-token-repository'
import { ILoadAccountByIdRepository } from '@/helpers/interfaces/database/mongodb/mongo-load-account-by-id-repository'

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    ILoadAccountByEmailRepository,
    IUpdateAccessTokenRepository,
    ILoadAccountByIdRepository {
  async add(
    data: IAddAccountParamsRepository
  ): Promise<IAccountWithoutTokenRepository> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.insertOne(data)

    return MongoHelper.map(account.ops[0])
  }

  async loadByEmail(email: string): Promise<IAccountRepository> {
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

  async loadByToken(token: string, role?: string): Promise<IAccountRepository> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ token })

    return account ? MongoHelper.map(account) : account
  }

  async loadById(id: string): Promise<IAccountRepository> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const account = await accountCollection.findOne({ _id: new ObjectId(id) })

    return account ? MongoHelper.map(account) : account
  }
}
