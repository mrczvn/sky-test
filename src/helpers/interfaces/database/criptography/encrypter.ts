export interface IEncrypter {
  encrypt(value: string): Promise<string>
}

export interface ICompare {
  compare(plaintext: string, digest: string): Promise<boolean>
}
