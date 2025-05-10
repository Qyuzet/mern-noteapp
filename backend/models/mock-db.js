/**
 * Mock database for development when MongoDB is not available
 * This provides a simple in-memory database for tasks
 */

// In-memory storage
const mockDb = {
  tasks: []
};

// Generate a random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Mock Product model
export const MockProduct = {
  // Find all tasks
  find: async () => {
    return [...mockDb.tasks];
  },
  
  // Find task by ID
  findById: async (id) => {
    return mockDb.tasks.find(task => task._id === id) || null;
  },
  
  // Create a new task
  create: async (data) => {
    const newTask = {
      _id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    mockDb.tasks.push(newTask);
    return newTask;
  },
  
  // Update a task
  findByIdAndUpdate: async (id, data, options) => {
    const index = mockDb.tasks.findIndex(task => task._id === id);
    
    if (index === -1) {
      return null;
    }
    
    const updatedTask = {
      ...mockDb.tasks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    mockDb.tasks[index] = updatedTask;
    return updatedTask;
  },
  
  // Delete a task
  findByIdAndDelete: async (id) => {
    const index = mockDb.tasks.findIndex(task => task._id === id);
    
    if (index === -1) {
      return null;
    }
    
    const deletedTask = mockDb.tasks[index];
    mockDb.tasks.splice(index, 1);
    return deletedTask;
  }
};

// Add some sample tasks
MockProduct.create({
  task: "Sample Task 1",
  priority: 3,
  image: "https://picsum.photos/200/300"
});

MockProduct.create({
  task: "Sample Task 2",
  priority: 2,
  image: "https://picsum.photos/200/300"
});

MockProduct.create({
  task: "Sample Task 3",
  priority: 4,
  image: "https://picsum.photos/200/300"
});

console.log("Mock database initialized with sample tasks");
