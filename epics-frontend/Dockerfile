# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clean install dependencies
RUN npm cache clean --force
RUN npm install --include=dev

# Explicitly install Vite to ensure it's properly installed
RUN npm install --save-dev vite@5.4.2

# Copy all project files (including vite.config.js)
COPY . .

# Build the project using npx
RUN npx vite build

# Serve stage
FROM node:18-alpine

WORKDIR /app

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Install serve - a simple static file server
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Command to serve the application
CMD ["serve", "-s", "dist", "-l", "3000"]
