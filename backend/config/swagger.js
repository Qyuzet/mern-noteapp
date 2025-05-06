import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Swagger definition
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Note App API",
      version: "1.0.0",
      description: "API documentation for the Note App",
      contact: {
        name: "API Support",
        email: "support@noteapp.com",
      },
    },
    servers: [
      {
        url: "/",
        description: "API Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      {
        name: "Users",
        description: "User management endpoints",
      },
      {
        name: "Todos",
        description: "Todo management endpoints",
      },
    ],
  },
  apis: ["./backend/routes/*.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

// Custom middleware to fix Swagger paths
const fixSwaggerPaths = (req, res, next) => {
  // If this is a Swagger request and it's trying to access the API
  if (req.url.startsWith("/api-docs/") && req.method === "GET") {
    // Continue with the request
    return next();
  }

  // For API requests from Swagger UI, remove the duplicate /api prefix
  if (req.url.startsWith("/api/api/")) {
    req.url = req.url.replace("/api/api/", "/api/");
  }

  next();
};

export const setupSwagger = (app) => {
  // Add the middleware to fix paths
  app.use(fixSwaggerPaths);

  // Set up Swagger UI
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      swaggerOptions: {
        persistAuthorization: true,
      },
    })
  );
};
