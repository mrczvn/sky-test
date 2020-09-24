import { Router } from 'express'
import { adaptRoute } from '../adapters/express-router-adappter'
import { makeSignInController } from '../factories/signin'

export default (router: Router): void => {
  router.post('/signin', adaptRoute(makeSignInController()))
}