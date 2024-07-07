import UserModel from "../models/UserModel.js"
import OrganizationModel from "../models/OrganizationModel.js"
import { UsersOrganizationsModel } from "../models/UsersOrganizationsModel.js"

// query db to findUser
export const getSingleUserRecord = async ({ attributes = ['userId', 'firstName', 'lastName', 'email', 'phone'], ...fields }) => {
  try {
    const user = await UserModel.findOne({
      where: { ...fields },
      attributes
    });
    
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
};

// add user to org
export const addUserToOrganization= async (userId, orgId)=> {
  try {
    const user = await UserModel.findByPk(userId);
    const org = await OrganizationModel.findByPk(orgId);
    
    if (!user || !org) {
      throw new Error('User or Organization not found');
    }

    await user.addOrganization(org);
    return user;

  } catch (error) {
    console.error('addUserToOrganization method - Error adding user to organization:', error);
    throw error;
  }
}

export const isSharedOrgs = async ({requestingUserId, requestedUserId}) => {
  try {
    const sharedOrgs = await UsersOrganizationsModel.findOne({
      where: {userId: requestingUserId},
      include: [{
        model: UsersOrganizationsModel,
        where: {userId: requestedUserId}
      }]
    });

    return !!sharedOrgs;

  } catch (error) {
    console.error('Error checking shared orgs:', error);
    throw error;
  }
};

