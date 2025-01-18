## Temporary image only used to build server
FROM node:18-alpine AS builder
WORKDIR /app
# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy only necessary files for the build
COPY src ./src
COPY @types ./@types
COPY tsconfig.json ./
COPY tsconfig-build.json ./
RUN yarn build

## Optimized image used as server
FROM node:18-alpine AS server
WORKDIR /app

COPY --from=builder ./app/build ./build
COPY package.json yarn.lock ./
COPY ssl ./ssl
RUN yarn install --production --frozen-lockfile

# Add a directory for uploads and ensure proper permissions
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

# Ensure logs directory exists and has the right permissions
RUN mkdir -p /app/logs && chown -R node:node /app/logs

EXPOSE ${PORT}
CMD ["yarn", "start"]