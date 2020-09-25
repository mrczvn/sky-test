import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { makeAuthMiddleware } from '../factories/auth-middleware'

export const auth = adaptMiddleware(makeAuthMiddleware())
