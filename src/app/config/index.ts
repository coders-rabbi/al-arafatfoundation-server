import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.join(process.cwd(), ".env") });
export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_token: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_token: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  client_url: process.env.CLIENT_URL,
  smpt_user: process.env.SMTP_USER,
  smpt_pass: process.env.SMTP_PASS,
  resend_api_key: process.env.RESEND_API_KEY,
  super_admin_pass: process.env.SUPER_ADMIN_PASS,
};

dotenv.config({ path: path.join(process.cwd(), ".env") });
