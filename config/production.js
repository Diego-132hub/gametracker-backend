export const productionConfig = {
  port: process.env.PORT || 10000,
  mongoURI: process.env.MONGODB_URI,
  nodeEnv: 'production'
};
