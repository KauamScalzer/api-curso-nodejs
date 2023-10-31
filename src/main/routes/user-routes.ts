import { Router } from 'express'
import { makeUserController } from '../factories/user/user-factory'
import { adaptRoute } from '../adapters/express-routes-adapter'

export default (router: Router): void => {
  router.post('/user', adaptRoute(makeUserController()))
}
