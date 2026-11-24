import express from 'express'
import { userRouter } from './user.router.js'
import { productRouter } from './product.router.js'

export const mainRouter = express.Router()

mainRouter.use('/users' ,userRouter)
<<<<<<< HEAD
mainRouter.use('/product' ,productRouter)
=======
mainRouter.use('/product' ,productRouter)
<<<<<<< HEAD
mainRouter.use('/products', getProductsRouter)
=======
>>>>>>> c56f5df (fixing profile route)
>>>>>>> f93616a (fixing things & new addition)
