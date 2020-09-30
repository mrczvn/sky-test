import { IAccount, ILoadAccountByIdRepository } from '../../helpers/interfaces'
import { ILoadAccountById } from '../../helpers/interfaces/db/load-account-by-id'

export class DbLoadAccountById implements ILoadAccountById {
  constructor(
    private readonly loadAccountByIdRepository: ILoadAccountByIdRepository
  ) {}

  async loadById(id: string): Promise<IAccount> {
    return await this.loadAccountByIdRepository.loadById(id)
  }
}
