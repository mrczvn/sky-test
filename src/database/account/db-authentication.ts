import {
  IAccountModel,
  ICompare,
  ILoadAccountByEmailRepository,
  ITokenEncrypter,
  IUpdateAccessTokenRepository
} from '../../helpers/interfaces'
import { IAuthentication } from '../../helpers/interfaces/authentication'

export class DbAuthentication implements IAuthentication {
  private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  private readonly hashCompare: ICompare
  private readonly encrypter: ITokenEncrypter
  private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository

  constructor(
    loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    hashCompare: ICompare,
    encrypter: ITokenEncrypter,
    updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.encrypter = encrypter
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth(email: string, password: string): Promise<IAccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (account) {
      const isValid = await this.hashCompare.compare(password, account.senha)

      if (isValid) {
        const accessToken = await this.encrypter.encrypt(account._id)

        await this.updateAccessTokenRepository.updateAccessToken(
          account._id,
          accessToken
        )

        const accountData = {
          id: account._id,
          data_criacao: account.data_criacao,
          data_atualizacao: account.data_atualizacao,
          ultimo_login: account.ultimo_login,
          token: accessToken
        }

        return accountData
      }
    }
    return null
  }
}
