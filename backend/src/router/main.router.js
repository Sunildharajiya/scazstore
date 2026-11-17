import express from 'express'
import { userRouter } from './user.router.js'
import { productRouter } from './product.router.js'

export const mainRouter = express.Router()

mainRouter.use('/users' ,userRouter)
mainRouter.use('/product' ,productRouter)