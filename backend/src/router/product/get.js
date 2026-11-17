
import express from "express";
import { Product } from "../../db/models/products.model.js";

export const getProductsRouter = express.Router();

const sortOptions = {
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  "price-low": { price: 1 },
  "price-high": { price: -1 },
  popular: { "rating.average": -1 },
};

const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const parseNumber = (value) => {
  if (value === undefined || value === "") return undefined;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
};

getProductsRouter.get("/", async (req, res) => {
  try {
    const {
      section,
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      latitude,
      longitude,
    } = req.query;

    // Validate string parameters
    const stringParams = {
      section,
      category,
      search,
      sort,
    };

    for (const [key, value] of Object.entries(stringParams)) {
      if (value !== undefined && typeof value !== "string") {
        return res.status(400).json({
          success: false,
          message: `Invalid ${key} parameter.`,
        });
      }
    }

    // Pagination
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 12);

    if (
      !Number.isInteger(page) ||
      page < 1 ||
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid pagination parameters.",
      });
    }

    const skip = (page - 1) * limit;

    // Price validation
    const min = parseNumber(minPrice);
    const max = parseNumber(maxPrice);

    if (
      min === null ||
      max === null ||
      (min !== undefined && min < 0) ||
      (max !== undefined && max < 0) ||
      (min !== undefined && max !== undefined && min > max)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid price range.",
      });
    }

    // Sorting
    const selectedSort = sort
      ? sortOptions[sort]
      : sortOptions.newest;

    if (!selectedSort) {
      return res.status(400).json({
        success: false,
        message: "Invalid sorting option.",
      });
    }

    // Base filter
    const filter = {
      isActive: true,
    };

    if (category?.trim()) {
      filter.category = category.trim().toLowerCase();
    }

    if (section?.trim()) {
      filter.sections = section.trim();
    }

    if (min !== undefined || max !== undefined) {
      filter.price = {};

      if (min !== undefined) filter.price.$gte = min;
      if (max !== undefined) filter.price.$lte = max;
    }

    const searchTerm = search?.trim() || "";

    // Location validation
    const hasLatitude = latitude !== undefined;
    const hasLongitude = longitude !== undefined;

    if (hasLatitude !== hasLongitude) {
      return res.status(400).json({
        success: false,
        message: "Both latitude and longitude are required.",
      });
    }

    let products = [];
    let totalProducts = 0;

    // ==================================
    // LOCATION-BASED PRODUCT DISCOVERY
    // ==================================

    if (hasLatitude && hasLongitude) {
      const lat = parseNumber(latitude);
      const lng = parseNumber(longitude);

      if (
        lat === null ||
        lng === null ||
        lat < -90 ||
        lat > 90 ||
        lng < -180 ||
        lng > 180
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid coordinates.",
        });
      }

      const pipeline = [
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [lng, lat],
            },
            key: "location",
            distanceField: "distanceMeters",
            maxDistance: 10000,
            spherical: true,
            query: filter,
          },
        },
      ];

      // Search by name, description and tags
      if (searchTerm) {
        const regex = new RegExp(
          escapeRegex(searchTerm),
          "i"
        );

        pipeline.push({
          $match: {
            $or: [
              { name: regex },
              { description: regex },
              { tags: regex },
            ],
          },
        });
      }

      // Explicit sorting overrides nearest-first ordering
      if (sort) {
        pipeline.push({
          $sort: selectedSort,
        });
      }

      pipeline.push({
        $facet: {
          metadata: [
            { $count: "total" },
          ],
          products: [
            { $skip: skip },
            { $limit: limit },
          ],
        },
      });

      const result = await Product.aggregate(pipeline);

      products = result[0]?.products || [];

      totalProducts =
        result[0]?.metadata[0]?.total || 0;

    } else {
      // ==================================
      // NORMAL PRODUCT DISCOVERY
      // ==================================

      if (searchTerm) {
        filter.$text = {
          $search: searchTerm,
        };
      }

      const projection = searchTerm
        ? { score: { $meta: "textScore" } }
        : {};

      let query = Product.find(filter, projection);

      if (searchTerm) {
        query = query.sort({
          score: { $meta: "textScore" },
          ...selectedSort,
        });
      } else {
        query = query.sort(selectedSort);
      }

      [products, totalProducts] = await Promise.all([
        query
          .skip(skip)
          .limit(limit)
          .lean(),

        Product.countDocuments(filter),
      ]);
    }

    // ==================================
    // RESPONSE
    // ==================================

    return res.status(200).json({
      success: true,
      products,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
    });

  } catch (error) {
    console.error("[PRODUCT:GET]", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load products.",
    });
  }
});
