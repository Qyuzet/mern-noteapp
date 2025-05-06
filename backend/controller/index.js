import { getDbType } from '../config/db-toggle.js';

// MongoDB controllers
import * as MongoProductController from './product.controller.js';
import * as MongoUserController from './user.controller.js';

// Sequelize controllers
import * as SequelizeProductController from './sequelize/product.controller.js';
import * as SequelizeUserController from './sequelize/user.controller.js';

// Get the current database type
const dbType = getDbType();

// Export the appropriate controllers based on the database type
let ProductController, UserController;

if (dbType === 'sequelize') {
  ProductController = SequelizeProductController;
  UserController = SequelizeUserController;
  console.log('Using Sequelize controllers');
} else {
  ProductController = MongoProductController;
  UserController = MongoUserController;
  console.log('Using MongoDB controllers');
}

export { ProductController, UserController };
