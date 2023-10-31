import { Router } from 'express'
import { makeCreateUserController } from '../factories/user/'
import { adaptRoute } from '../adapters/express-routes-adapter'

export default (router: Router): void => {
  router.post('/user', adaptRoute(makeCreateUserController()))
}
