const { config } = require("dotenv");
config({ path: __dirname + "/../.env" });
const env = process.env;

export default {
  HOST: env.HOST || "localhost",
  PORT: env.HTTPPORT || 1234,
  SUPABASE_URL: env.SUPABASE_URL || "",
  SUPABASE_KEY: env.SUPABASE_KEY || "",
  JWT_KEY: env.JWT_KEY || "",
};
