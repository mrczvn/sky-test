export interface ITokenEncrypter {
  encrypt(plaintext: string): Promise<string>
}

export interface ITokenDecrypter {
  decrypt(ciphertext: string): Promise<string | Object>
}
