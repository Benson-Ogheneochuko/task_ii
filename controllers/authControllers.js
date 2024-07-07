import { UserModel } from "../models/UserModel.js";
import bcrypt from 'bcrypt'
import { createJWT } from "../utils/createJWT.js";
import { createOrganization } from "../utils/orgMethods.js";
import { addUserToOrganization } from "../utils/userMethods.js";

// todo:: next will autocreate organization
export const registerController = async (req, res) => {
  const userData = req.body;
  
  try {
    userData.password= await bcrypt.hash(userData.password, 10)
    const userToken = await createJWT({email: userData["email"], userId: userData.userId})
    if(!userToken) {
      return res.status(401).json({
        status: 'fail',
        message: 'could not create userToken',
        data: {
          userToken
        }
      })
    }
    const user = await UserModel.create(userData);

    try {
      const userOrg =  await createOrganization({name: `${userData.firstName}'s Organisation`, description: 'default organisation'})
      await addUserToOrganization(user.userId, userOrg.orgId)

      if (!userOrg){
        return res.status(401).json({
          status: 'failed to create user org',
          message: 'could not create user org'
        })
      }
    } catch (error) {
      console.error(error.message)
      res.status(500).json({ error: 'Registration failed', details: error.message });
      throw error
    }
    
    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken: userToken,
        user,
      },
    });

  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

// todo:: next will select organization to interact with
export const loginController = async (req, res) => {
  console.log("login controller");
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({
      where: { email: email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 400,
      });
    }

    delete user.dataValues.password;
    const userToken = await createJWT({email, userId: user.userId})
    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken: userToken,
        user: user,
      },
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred during login",
      statusCode: 500,
    });
  }
}
