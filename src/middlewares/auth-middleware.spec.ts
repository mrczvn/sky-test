import { AccessDeniedError } from '../helpers/errors/access-denied-error'
import { forbidden } from '../helpers/http'
import { AuthMiddleware } from './auth-middleware'

const makeSut = (): AuthMiddleware => new AuthMiddleware()

describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const sut = makeSut()

    const httpResponse = await sut.handle({})

    expect(httpResponse).toEqual(
      forbidden(new AccessDeniedError('Não autorizado'))
    )
  })
})
