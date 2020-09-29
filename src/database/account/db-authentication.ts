import {
  IAccountModel,
  ICompare,
  ILoadAccountByEmailRepository,
  ITokenEncrypter,
  IUpdateAccessTokenRepository
} from '../../helpers/interfaces'
import { IAuthentication } from '../../helpers/interfaces/db/authentication'
import { transformeAccountModel } from '../../utils/transforme-account-model'

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashCompare: ICompare,
    private readonly encrypter: ITokenEncrypter,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository
  ) {}

  async auth(email: string, password: string): Promise<IAccountModel> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(email)

    if (account) {
      const isValidComparison = await this.hashCompare.compare(
        password,
        account.senha
      )

      if (isValidComparison) {
        const accessToken = await this.encrypter.encrypt(account.id)

        await this.updateAccessTokenRepository.updateAccessToken(
          account.id,
          accessToken
        )

        return transformeAccountModel({ ...account, token: accessToken })
      }
    }
    return null
  }
}
