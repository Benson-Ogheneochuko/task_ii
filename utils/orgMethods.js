import { OrganizationModel } from "../models/OrganizationModel.js";
import { UsersOrganizationsModel } from "../models/UsersOrganizationsModel.js";
// create org Method
export const createOrganization = async (orgData) => {
  const { name, description = '' } = orgData;
  const organizationData = { name, description };
  return await OrganizationModel.create(organizationData);
};


// get org list method
export const getOrgList = async (userId) => {
  try {
    const orgList = await UsersOrganizationsModel.findAll({
      where: {userId},
      include: [{ model: OrganizationModel }]
    });

    if (orgList.length === 0) {
      throw new Error("No organizations found for this user");
    }

    return orgList;
  } catch (error) {
    console.error("Error finding organization(s):", error);
    throw error;
  }
};


// get single org method - details of a single org
export const getSingleOrg = async (orgId) => {
  try {
    const org = await OrganizationModel.findOne({
      where: {orgId}
    }); 

    if (!org) {
      throw new Error("organization not found");
    }  

    return org;
  } catch (error) {
    console.error("Error finding organization:", error);
    throw error;
  }  
}; 