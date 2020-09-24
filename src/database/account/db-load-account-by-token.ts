import {
  IAccountModel,
  ILoadAccountByToken,
  ITokenDecrypter
} from '../../helpers/interfaces'

export class DbLoadAccountByToken implements ILoadAccountByToken {
  constructor(private readonly decrypter: ITokenDecrypter) {}

  async load(accessToken: string, role?: string): Promise<IAccountModel> {
    await this.decrypter.decrypt(accessToken)

    return null
  }
}
