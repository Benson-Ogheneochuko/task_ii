// controllers/userController.js
import { addUserToOrganization, getSingleUserRecord, isSharedOrgs } from '../utils/userMethods.js';

export const getUserRecordController = async (req, res) => {
  try {
    const { id: requestedUserId } = req.params;
    const { userId: requestingUserId } = req.user;

    if (requestedUserId !== requestingUserId) {
      let sharedOrgs;
      try {
        sharedOrgs = await isSharedOrgs({requestingUserId, requestedUserId});
      } catch (error) {
        console.error('Error checking shared orgs:', error);
        return res.status(500).json({ status: 'error', message: 'Error checking organization access' });
      }
  
      if (!sharedOrgs) {
        return res.status(403).json({ status: 'fail', message: 'Does not share orgs, access denied' });
      }
    }

    const requestedUser = await getSingleUserRecord({userId: requestedUserId});

    if (!requestedUser) {
      return res.status(404).json({ status: 'fail', message: 'User not found' });
    }

    res.status(200).json({
      status: 'success',
      message: 'User details retrieved successfully',
      data: requestedUser
    });

  } catch (error) {
    console.error('Error in getUserRecordController:', error);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};




// !ADD USER TO ORG CONTROLLER
export const addUserToOrgController= async (req, res)=> {
  const {userId} = req.body
  const {orgId} = req.params

  try {
    if (!userId || !orgId) {
      throw new Error('User or Organization Id not provided');
    }

    const userOrg= await addUserToOrganization(userId, orgId)

    if(!userOrg){
      return res.status(400).json({ status: 'fail', message: 'User not added to organization' });
    }

    res.status(200).json({
      "status": "success",
      "message": "User added to organisation successfully"
    })

  } catch (error) {
    console.error('addUserToOrgController - Error adding user to organization:', error);
    throw error;
  }
}