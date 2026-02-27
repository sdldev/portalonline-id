# Build Stage
FROM oven/bun:1 AS build
WORKDIR /app

# Install dependencies
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile || bun install

# Copy source and build
COPY . .
RUN bun run build

# Production Stage - Nginx for static files
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built static files
COPY --from=build /app/dist .

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Security: Run as non-root user
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
