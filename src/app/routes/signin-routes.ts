import { Router } from 'express'
import { adaptRoute } from '../adapters/express-router-adapter'
import { makeSignInController } from '../factories/controllers/login/signin/signin-factory'

export default (router: Router): void => {
  router.post('/signin', adaptRoute(makeSignInController()))
}
