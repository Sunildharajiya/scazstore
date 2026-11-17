
import express from "express";
import { Product } from "../../../src/db/models/products.model.js";

export const createProductRouter = express.Router();

createProductRouter.post("/", async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      category,
      sections,
      tags,
      price,
      compareAtPrice,
      currency,
      images,
      stock,
      sku,
      location,
      sellerId,
    } = req.body || {};

    // Required fields
    if (
      !name ||
      !slug ||
      !description ||
      !category ||
      price === undefined ||
      !sellerId ||
      !images?.length
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required product fields.",
      });
    }

    // Create product
    const product = await Product.create({
      name,
      slug,
      description,
      category,
      sections: sections || [],
      tags: tags || [],
      price,
      compareAtPrice,
      currency: currency || "INR",
      images,
      stock: stock ?? 0,
      sku,
      location,
      sellerId,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });

  } catch (error) {
    console.error("[PRODUCT:CREATE]", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Product slug or SKU already exists.",
      });
    }

    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create product.",
    });
  }
});
