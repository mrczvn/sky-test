export default {
  mongoUrl:
    process.env.MONGO_URL ||
    'mongodb+srv://test_sky:test_sky@cluster0.rnk3s.mongodb.net/Cluste0?retryWrites=true&w=majority',
  port: process.env.PORT || 3000
}
