# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /IIT-ISM-CHAT-BOT-FRONTEND

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
COPY . .
RUN npm run build

# Step 2: Serve the app with a lightweight HTTP server
FROM nginx:stable-alpine

# Copy built app to Nginx's default public folder
COPY --from=build /app/build /usr/share/nginx/html

# Optional: Replace the default Nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
