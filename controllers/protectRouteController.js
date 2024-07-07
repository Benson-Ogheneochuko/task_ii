import jwt from "jsonwebtoken";
import {UserModel} from "../models/UserModel.js";

export const isValidTokenController= async (req,res,next)=>{
  try {
    const token = req.header('Authorization')?.split(' ')[1]
    if (!token){
      return res.status(401).json({ status: 'fail', message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.AUTH_SECRET_STRING)
    const user= await UserModel.findByPk(decoded.userId)

    if (!user) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ status: 'fail', message: 'Token is not valid' });
  }
}