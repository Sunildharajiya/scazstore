  // Fetch homepage product sections
  const loadProducts = useCallback(async () => {
    setLoading(true);

    try {
      const results = await Promise.allSettled(
        SECTIONS.map(async (section) => {
          if (section.id === "nearby" && !location) {
            return {
              id: section.id,
              products: [],
            };
          }

          const category =
            activeCategory !== "all"
              ? activeCategory
              : section.category || "";

          const result = await getProducts({
            section:
              section.id === "vegetables" ||
              section.id === "nearby"
                ? undefined
                : section.id,

            limit: section.limit,
            category,

            ...(section.id === "nearby" ? location : {}),
          });

          return {
            id: section.id,
            products: result,
          };
        })
      );

      const newProducts = {};
      const newErrors = {};

      results.forEach((result, index) => {
        const sectionId = SECTIONS[index].id;

        if (result.status === "fulfilled") {
          newProducts[sectionId] = Array.isArray(result.value.products)
            ? result.value.products
            : [];
        } else {
          newProducts[sectionId] = [];
          newErrors[sectionId] =
            result.reason?.message || "Unable to load products.";
        }
      });

      setProducts(newProducts);
      setErrors(newErrors);
    } catch (error) {
      console.error("[PRODUCT SECTIONS] Failed to load products:", error);
      setErrors((previous) => ({
        ...previous,
        global: error.message || "Unable to load products.",
      }));
    } finally {
      setLoading(false);
    }
  }, [activeCategory, location]);
