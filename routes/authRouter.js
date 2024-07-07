import express from 'express'
const authRouter = express.Router()
import {registerController, loginController} from '../controllers/authControllers.js'
import { validateOrgInput, createOrgController } from '../controllers/orgControllers.js'
import { responseController } from '../controllers/responseController.js'

authRouter
  .route('/register')
  .post(registerController, validateOrgInput, createOrgController, responseController)

authRouter
  .route('/login')
  .post(loginController)
export default authRouter;