import { MongoHelper } from '../database/mongo-helper'
import app from './app'
import env from './config/env'

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    app.listen(env.port, () =>
      console.log(`Server running at http://localhost:${env.port}`)
    )
  })
  .catch(console.error)
