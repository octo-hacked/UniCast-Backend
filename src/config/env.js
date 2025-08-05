import 'dotenv/config'; // Loads .env file contents into process.env

export const config = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGO_URI,
  auth: {
    secret: process.env.AUTH_SECRET,
    expressUrl: process.env.AUTH_EXPRESS_URL,
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
  },
};