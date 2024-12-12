## Temporary image only used to build server
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install --frozen-lockfile
RUN yarn build

## Optimized image used as server
FROM node:18-alpine AS server
WORKDIR /app
COPY --from=builder ./app/build ./build
COPY package* ./
COPY yarn.lock ./
RUN yarn install --production
# Add a directory for uploads and ensure proper permissions
RUN mkdir -p /app/uploads && chown -R node:node /app/uploads
EXPOSE 8080
CMD ["yarn", "start"]