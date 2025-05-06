import express from "express";
import { ProductController } from "../controller/index.js";
import { protect, verified } from "../middleware/auth.middleware.js";
import {
  validateTodoData,
  validateTodoId,
  logTodoOperation,
} from "../middleware/todo.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all todos
 *     tags: [Todos]
 *     responses:
 *       200:
 *         description: Todos retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/", logTodoOperation, ProductController.getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - priority
 *               - image
 *             properties:
 *               task:
 *                 type: string
 *               priority:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized, no token
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  protect,
  verified,
  validateTodoData,
  logTodoOperation,
  ProductController.createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *               priority:
 *                 type: number
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id",
  protect,
  verified,
  validateTodoId,
  logTodoOperation,
  ProductController.updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Todo ID
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       401:
 *         description: Not authorized, no token
 *       404:
 *         description: Todo not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/:id",
  protect,
  verified,
  validateTodoId,
  logTodoOperation,
  ProductController.deleteProduct
);

export default router;
