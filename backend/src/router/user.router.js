import express from 'express'
import { createUserRouter } from './user/create.js'
import { loginUserRouter } from './user/login.js'
import { newAxcToken } from './user/newAxcToken.js'

export const userRouter = express.Router()



userRouter.use("/signup",createUserRouter)

userRouter.use("/login",loginUserRouter)

userRouter.use("/newAxcToken",newAxcToken)
