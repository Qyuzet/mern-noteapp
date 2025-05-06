import { Product } from "../../models/index.js";

export const getProducts = async (req, res) => {
  try {
    console.log("[Sequelize] Getting all products");
    const products = await Product.findAll();
    console.log("[Sequelize] Found products:", products.length);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("[Sequelize] Error in fetching products:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const product = req.body;
  console.log("[Sequelize] Creating product:", product);

  if (!product.task || !product.priority || !product.image) {
    console.log("[Sequelize] Missing required fields");
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  try {
    const newProduct = await Product.create(product);
    console.log("[Sequelize] Product created:", newProduct.id);
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("[Sequelize] Error in Create product:", error.message);
    console.error("[Sequelize] Error details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  console.log("[Sequelize] Updating product:", id, updates);

  try {
    const product = await Product.findByPk(id);
    console.log("[Sequelize] Found product to update:", product ? "Yes" : "No");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update product
    await product.update(updates);
    console.log("[Sequelize] Product updated successfully");

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("[Sequelize] Error in Update product:", error.message);
    console.error("[Sequelize] Error details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  console.log("[Sequelize] Deleting product:", id);

  try {
    const product = await Product.findByPk(id);
    console.log("[Sequelize] Found product to delete:", product ? "Yes" : "No");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Delete product
    await product.destroy();
    console.log("[Sequelize] Product deleted successfully");

    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("[Sequelize] Error in Delete product:", error.message);
    console.error("[Sequelize] Error details:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
