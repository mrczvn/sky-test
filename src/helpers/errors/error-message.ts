export class ErrorMessage extends Error {
  constructor() {
    super('mensagem de error')

    this.name = 'mensagem de error'
  }
}
