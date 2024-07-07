import { getSingleOrg, getOrgList, createOrganization } from "../utils/orgMethods.js";

// http handler for creating org
export const createOrgController = async (req, res) => {
  try {
    const organization = await createOrganization(req.validatedOrgData);

    res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: organization.orgId,
        name: organization.name,
        description: organization.description,
      },
    });
  } catch (error) {
    console.error("Error creating organization:", error);
    res.status(400).json({
      status: "Bad Request",
      message: 'Client error',
      statusCode: 400,
    });
  }
};

// check source & validate org data in request middleware
export const validateOrgInput = (req, res, next) => {
  let { name, description } = req.body;

  if (res.locals.isFromRegistration && name) {
    name = `${name}'s organization`;
  }

  if (!name) {
    return res.status(400).json({
      status: "Bad Request",
      message: "Client error",
      statusCode: 400,
    });
  }

  req.validatedOrgData = { name, description };
  next();
};
// !End of create org












 

// get single orgnizations with orgId
export const getSingleOrgController= async (req, res)=>{
  const {orgId} = req.params
  try {
    const org = await getSingleOrg(orgId)
    if (!org) {
      return res.status(400).json({
        status: "Bad request",
        message: "organisation not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "found organisation",
      data: {
        orgId: org.orgId,
        name: org.name,
        description: org.description,
      },
    });
  } catch (error) {
    console.error(error)
    res.status(404).json({
      status: "Bad Request",
      message: `could not find organization \n ${error.message}`,
    });
  }
}

// get all user orgs those they created and those they belong to
export const orgListController = async(req, res) => {
  const {userId} = req.user

  try {
    const orgList= await getOrgList(userId)
    if (!orgList) {
      res.status(404).json({
        status: 'Fail',
        message: 'could not find user organizations'
      })
    }

    res.status(200).json({
      status: 'success',
      message: 'user organization list',
      data: {
        orgList
      }
    })
  } catch (error) {
    console.error(error)
    res.status(404).json({
      status: 'Fail',
      message: 'could not find user organizations'
    })
  }
};
// !End of getOrg with orgId
