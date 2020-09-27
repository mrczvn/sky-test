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
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      )

      const invalidSession: any = 'Sessão inválida'

      if (!account) return invalidSession

      return account
    }
    return null
  }
}
