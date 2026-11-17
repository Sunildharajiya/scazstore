import express from 'express'
import env from 'dotenv'
import cors from "cors";
import cookie from 'cookie-parser'


import { mongoConnect } from './db/mongodb_connection.js'

import { mainRouter } from './router/main.router.js'

const app = express();
env.config()

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookie());
app.use("/api",mainRouter)


app.get("/h",(req,res)=>{
  res.send("good")
})

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