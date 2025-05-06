#!/bin/bash

# Rename the new files to replace the existing ones
mv backend/server.js.new backend/server.js
mv backend/routes/product.route.js.new backend/routes/product.route.js
mv backend/routes/user.route.js.new backend/routes/user.route.js

echo "Files renamed successfully!"
