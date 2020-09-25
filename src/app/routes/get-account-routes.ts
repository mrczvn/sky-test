import { Router } from 'express'
import { adaptRoute } from '../adapters/express-router-adapter'
import { makeGetAccount } from '../factories/get-account'
import { auth } from '../middlewares/admin.auth'

export default (router: Router): void => {
  router.get('/account', auth, adaptRoute(makeGetAccount()))
}
