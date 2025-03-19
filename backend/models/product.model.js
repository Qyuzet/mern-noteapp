import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    priority: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, //createdAT, updatedAt
  }
);

const Product = mongoose.model("Task", productSchema);

export default Product;
