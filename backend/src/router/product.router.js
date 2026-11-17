import express from 'express'

export const productRouter = express.Router()

import { getProductsRouter } from "./product/get.js";
import { createProductRouter } from './product/create.js'

productRouter.use('/create',createProductRouter)

productRouter.use("/products", getProductsRouter);

