import {
  IAddAccount,
  IEncrypter,
  ILoadAccountByEmailRepository,
  IAddAccountRepository,
  IAddAccountParams,
  IAccountWithoutToken
} from './db-add-account-interfaces'

export class DbAddAccount implements IAddAccount {
  constructor(
    private readonly encrypter: IEncrypter,
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly addAccountRepository: IAddAccountRepository
  ) {}

  async add(account: IAddAccountParams): Promise<IAccountWithoutToken> {
    const emailInUse = await this.loadAccountByEmailRepository.loadByEmail(
      account.email
    )

    if (!emailInUse) {
      const hashedPassword = await this.encrypter.encrypt(account.senha)

      const atThisMoment = new Date()

      return await this.addAccountRepository.add({
        ...account,
        senha: hashedPassword,
        data_criacao: atThisMoment,
        data_atualizacao: atThisMoment,
        ultimo_login: atThisMoment
      })
    }
    return null
  }
}
