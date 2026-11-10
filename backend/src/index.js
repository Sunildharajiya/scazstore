import express from 'express'
import env from 'dotenv'

const app = express();
env.config()

import { mongoConnect } from './db/mongodb_connection.js'

import {mainRouter} from './router/main.router.js'
app.use("/api/",mainRouter)
mongoConnect().then(()=>{
  app.listen(5000, ()=> {
  console.log("server started successfully !!")
})
})
  .catch((error) =>{
  console.log("Error in mongoConnect process")
  console.log("Error: " + error)
  process.exit(1)
})