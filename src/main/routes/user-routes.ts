import { Router } from 'express'
import { makeCreateUserController, makeUserAuthenticationController } from '../factories/user'
import { adaptRoute } from '../adapters/express'

export default (router: Router): void => {
  router.post('/user', adaptRoute(makeCreateUserController()))
  router.post('/user/authentication', adaptRoute(makeUserAuthenticationController()))
}
