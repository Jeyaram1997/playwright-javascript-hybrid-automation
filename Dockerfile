# Use official Playwright image with Node.js
FROM mcr.microsoft.com/playwright:v1.38.0-focal

# Set working directory
WORKDIR /app

# Set environment variables
ENV CI=true
ENV NODE_ENV=production
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Create app user for security
RUN groupadd -r automation && useradd -r -g automation -s /bin/bash automation

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create reports and logs directories
RUN mkdir -p reports/screenshots reports/logs reports/allure-results && \
    chown -R automation:automation /app

# Install browsers (already available in base image)
RUN npx playwright install --with-deps

# Set proper permissions
RUN chmod +x cli.js

# Switch to non-root user
USER automation

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node cli.js doctor || exit 1

# Expose port for report server (optional)
EXPOSE 8080

# Default command
CMD ["npm", "test"]
