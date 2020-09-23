import bcrypt from 'bcrypt'
import { ICompare, IEncrypter } from '../../../helpers/interfaces/encrypter'

export class BcryptAdapter implements IEncrypter, ICompare {
  private readonly salt: number

  constructor(salt: number) {
    this.salt = salt
  }

  async encrypt(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)

    return hash
  }

  async compare(plaintext: string, digest: string): Promise<boolean> {
    const isValid = await bcrypt.compare(plaintext, digest)

    return isValid
  }
}
