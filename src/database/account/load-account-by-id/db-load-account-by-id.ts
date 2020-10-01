import {
  ILoadAccountById,
  ILoadAccountByIdRepository,
  IAccount
} from './db-load-account-by-id-interfaces'

export class DbLoadAccountById implements ILoadAccountById {
  constructor(
    private readonly loadAccountByIdRepository: ILoadAccountByIdRepository
  ) {}

  async loadById(id: string): Promise<IAccount> {
    return await this.loadAccountByIdRepository.loadById(id)
  }
}
