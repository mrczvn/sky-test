import jwt from 'jsonwebtoken'
import { ITokenEncrypter, ITokenDecrypter } from '@/helpers/interfaces'

export class JwtAdapter implements ITokenEncrypter, ITokenDecrypter {
  private readonly secret: string

  constructor(secret: string) {
    this.secret = secret
  }

  async encrypt(plaintext: string): Promise<string> {
    const ciphertext = jwt.sign({ id: plaintext }, this.secret)

    return ciphertext
  }

  async decrypt(ciphertext: string): Promise<string | Object> {
    try {
      return jwt.verify(ciphertext, this.secret)
    } catch (error) {
      return null
    }
  }
}
