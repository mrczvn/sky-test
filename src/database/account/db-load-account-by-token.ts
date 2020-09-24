import {
  IAccountModel,
  ILoadAccountByToken,
  ILoadAccountByTokenRepository,
  ITokenDecrypter
} from '../../helpers/interfaces'

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor(
    private readonly decrypter: ITokenDecrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<IAccountModel> {
    const token = await this.decrypter.decrypt(accessToken)

    if (token) {
      await this.loadAccountByTokenRepository.loadByToken(accessToken, role)
    }
    return null
  }
}
