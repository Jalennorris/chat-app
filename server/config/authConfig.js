import dotenv from 'dotenv';
dotenv.config();

const authConfig = {
  jwt: {
    secret: process.env.SECRET_ACCESS_TOKEN ,
    expiresIn: process.env.JWT_EXPIRES_IN ,
  },
};


export const SECRET_ACCESS_TOKEN = authConfig.jwt.secret;

export default authConfig;

