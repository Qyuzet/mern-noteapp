import { getDbType } from '../config/db-toggle.js';

// MongoDB models
import MongoUser from './user.model.js';
import MongoProduct from './product.model.js';

// Sequelize models
import SequelizeUser from './sequelize/user.model.js';
import SequelizeProduct from './sequelize/product.model.js';

// Get the current database type
const dbType = getDbType();

// Export the appropriate models based on the database type
let User, Product;

if (dbType === 'sequelize') {
  User = SequelizeUser;
  Product = SequelizeProduct;
  
  // Initialize Sequelize models
  const initModels = async () => {
    await User.sync();
    await Product.sync();
    console.log('Sequelize models synchronized successfully');
  };
  
  initModels().catch(err => console.error('Error initializing Sequelize models:', err));
} else {
  User = MongoUser;
  Product = MongoProduct;
}

export { User, Product };
