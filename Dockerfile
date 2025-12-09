# Multi-stage Dockerfile for Vue.js application
# Stage 1: Build the application
FROM node:20-alpine AS build

# Set working directory
WORKDIR /app

# Install Yarn
RUN corepack enable && corepack prepare yarn@4.9.1 --activate

# Copy package manager files
COPY .yarn/ .yarn/
COPY package.json yarn.lock ./

# Set Yarn 4 berry configuration
COPY .yarnrc.yml ./

# Install dependencies using Yarn
RUN yarn install --immutable

# Copy project files
COPY . .

# Build the application
RUN yarn build

# Stage 2: Serve the application
FROM nginx:alpine AS serve

# Copy built application from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]