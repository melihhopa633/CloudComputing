# Use official Node.js LTS image
FROM node:18-alpine

WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Deploy contract
RUN node deploy.js || true

# Expose port
EXPOSE 4002

# Start the application with nodemon
CMD ["nodemon", "--legacy-watch", "index.js"]