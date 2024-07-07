import express from 'express'
const orgRouter = express.Router()
import { isValidTokenController } from '../controllers/protectRouteController.js'
import {validateOrgInput, createOrgController, orgListController, getSingleOrgController} from '../controllers/orgControllers.js'
import { addUserToOrgController, getUserRecordController } from '../controllers/userControllers.js'

// user is logged in and token is valid
// todo:: isLoggedIn
orgRouter
  .route('/users/:id')
  .get(isValidTokenController, getUserRecordController)

// organisation
orgRouter
  .route('/organisations')
  .get(isValidTokenController, orgListController)// they can get all their organisations if they're logged in properly
  .post(isValidTokenController, validateOrgInput, createOrgController)// Protected - user can create their own org

orgRouter
  .route('/organisations/:orgId')
  .get(isValidTokenController,getSingleOrgController)

orgRouter
  .route('/organisations/:orgId/users')
  .post(addUserToOrgController)


export default orgRouter;