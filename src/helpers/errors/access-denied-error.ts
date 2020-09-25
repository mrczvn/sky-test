export class AccessDeniedError extends Error {
  constructor(paramName: string) {
    super(paramName)

    this.name = paramName
  }
}
