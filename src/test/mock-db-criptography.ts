import { ICompare, ITokenEncrypter } from '@/helpers/interfaces'

export class HashCompareSpy implements ICompare {
  plaintext: string
  digest: string
  resultComparison: boolean = true

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext
    this.digest = digest

    return this.resultComparison
  }
}

export class EncrypterSpy implements ITokenEncrypter {
  plaintext: string
  accessToken: string = 'any_token'

  async encrypt(plaintext: string): Promise<string> {
    this.plaintext = plaintext

    return this.accessToken
  }
}
