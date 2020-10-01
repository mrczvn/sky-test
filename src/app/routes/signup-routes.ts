import { Router } from 'express'
import { adaptRoute } from '../adapters/express-router-adapter'
import { makeSignUpController } from '../factories/controllers/login/signup/signup-factory'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()))
}
