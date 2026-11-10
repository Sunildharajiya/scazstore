import express from 'express'
export const mainRouter = express.Router()

mainRouter.get("/h",(req,res)=>{
  res.send("hello");
  console.log(req.ip)
})

