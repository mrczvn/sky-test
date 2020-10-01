import {
  IAccount,
  ILoadAccountByToken,
  ILoadAccountByTokenRepository,
  ITokenDecrypter
} from './db-load-account-by-token-interfaces'

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor(
    private readonly decrypter: ITokenDecrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
  ) {}

  async load(accessToken: string, role?: string): Promise<IAccount> {
    const token = await this.decrypter.decrypt(accessToken)
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      )

      return account
    }
    return null
  }
}
