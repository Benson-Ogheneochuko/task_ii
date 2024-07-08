import express from 'express'
const authRouter = express.Router()
import {registerController, loginController} from '../controllers/authControllers.js'

authRouter
  .route('/register')
  .post(registerController)

authRouter
  .route('/login')
  .post(loginController)
export default authRouter;