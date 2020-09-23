export default {
  mongoUrl:
    process.env.MONGO_URL_DEV || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 3000
}
