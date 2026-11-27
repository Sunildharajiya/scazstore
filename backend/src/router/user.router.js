import express from 'express'
import { createUserRouter } from './user/signup.js'
import { loginUserRouter } from './user/login.js'
import { newAxcToken } from './user/newAxcToken.js'
import { userProfile } from './user/userProfileData.js'

export const userRouter = express.Router()

userRouter.use("/signup",createUserRouter)

userRouter.use("/login",loginUserRouter)

userRouter.use("/newAxcToken",newAxcToken)

userRouter.use("/profile", userProfile)
