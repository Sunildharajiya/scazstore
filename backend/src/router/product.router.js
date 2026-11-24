import express from "express";
import { getProductsRouter } from "./product/get.js";
import { createProductRouter } from "./product/create.js";

export const productRouter = express.Router();

// POST /api/product/create
productRouter.use("/create", createProductRouter);

// GET /api/product (primary endpoint)
productRouter.use("/", getProductsRouter);

// Backward-compatible GET /api/product/products
productRouter.use("/products", getProductsRouter);
