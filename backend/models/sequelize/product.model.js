import { DataTypes } from "sequelize";
import sequelize from "../../config/sequelize.js";

const Product = sequelize.define(
  "Task",
  {
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Product;
