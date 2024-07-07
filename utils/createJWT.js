import jwt from "jsonwebtoken";

export const createJWT = async (
  payload,
  secret = process.env.AUTH_SECRET_STRING
) => {
  try {
    if (!secret) {
      throw new Error("JWT needs a secret");
    }

    if (typeof payload !== "object" || Object.keys(payload) === 0) {
      throw new Error("Invalid or empty payload");
    }

    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, (err, token) => {
        err
        ? reject(new Error("Failed to create JWT: " + err.message))
        : token
        ? resolve(token)
        : reject(new Error("Failed to create JWT: No token generated"));
      });
    });
  } catch (error) {
    throw new Error('error creating JWT: ' + error.message)
  }
};
