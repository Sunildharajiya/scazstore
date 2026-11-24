import express from "express";
import { Product } from "../../db/models/products.model.js";

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
    } = req.body || {};

    // Validate required fields before asking Mongoose to create the document.
    const missingFields = [];
    if (typeof name !== "string" || !name.trim()) missingFields.push("name");
    if (typeof slug !== "string" || !slug.trim()) missingFields.push("slug");
    if (typeof description !== "string" || !description.trim()) missingFields.push("description");
    if (typeof category !== "string" || !category.trim()) missingFields.push("category");
    if (price === undefined || price === null || price === "" || !Number.isFinite(Number(price))) {
      missingFields.push("price");
    }
    if (!Array.isArray(images) || images.length === 0) missingFields.push("images");

    if (missingFields.length) {
      return res.status(400).json({
        success: false,
        message: "Missing or invalid required product fields.",
        fields: missingFields,
      });
    }

    const product = await Product.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description.trim(),
      category: category.trim().toLowerCase(),
      sections: Array.isArray(sections) ? sections : [],
      tags: Array.isArray(tags) ? tags : [],
      price: Number(price),
      compareAtPrice: compareAtPrice === "" || compareAtPrice == null
        ? null
        : Number(compareAtPrice),
      currency: currency || "INR",
      images,
      stock: stock === undefined ? 0 : Number(stock),
      sku: sku || undefined,
      location,
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
        field: Object.keys(error.keyPattern || {})[0] || "unknown",
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
