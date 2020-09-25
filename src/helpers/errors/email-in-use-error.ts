export class EmailInUseError extends Error {
  constructor() {
    super('E-mail já existente')

    this.name = 'E-mail já existente'
  }
}
