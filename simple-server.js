// Simple Express server with mock data
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 7778;

// Middleware
app.use(express.json());
app.use(cors());

// Mock data
const tasks = [
  {
    _id: '1',
    task: 'Learn React',
    priority: 3,
    image: 'https://picsum.photos/200/300?random=1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    task: 'Build a MERN app',
    priority: 4,
    image: 'https://picsum.photos/200/300?random=2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    task: 'Deploy to production',
    priority: 2,
    image: 'https://picsum.photos/200/300?random=3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Routes
// Get all tasks
app.get('/api/products', (req, res) => {
  console.log('GET /api/products');
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// Create a task
app.post('/api/products', (req, res) => {
  console.log('POST /api/products', req.body);
  const { task, priority, image } = req.body;
  
  if (!task || !priority || !image) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: task, priority, and image'
    });
  }
  
  const newTask = {
    _id: Date.now().toString(),
    task,
    priority,
    image,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  tasks.push(newTask);
  
  res.status(201).json({
    success: true,
    message: 'Task created successfully',
    data: newTask
  });
});

// Update a task
app.put('/api/products/:id', (req, res) => {
  console.log(`PUT /api/products/${req.params.id}`, req.body);
  const { id } = req.params;
  const { task, priority, image } = req.body;
  
  const taskIndex = tasks.findIndex(t => t._id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...(task && { task }),
    ...(priority && { priority }),
    ...(image && { image }),
    updatedAt: new Date().toISOString()
  };
  
  tasks[taskIndex] = updatedTask;
  
  res.json({
    success: true,
    message: 'Task updated successfully',
    data: updatedTask
  });
});

// Delete a task
app.delete('/api/products/:id', (req, res) => {
  console.log(`DELETE /api/products/${req.params.id}`);
  const { id } = req.params;
  
  const taskIndex = tasks.findIndex(t => t._id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Task not found'
    });
  }
  
  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  
  res.json({
    success: true,
    message: 'Task deleted successfully',
    data: id
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
