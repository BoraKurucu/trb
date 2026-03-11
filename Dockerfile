# Build stage
FROM node:18-alpine as build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy built assets to Nginx html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx config if we had routing, but for a single page app the default is often fine.
# We expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
