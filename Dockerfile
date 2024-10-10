# Use Node.js 20 Alpine as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install yarn
RUN apk add --no-cache yarn curl

# Copy package.json and yarn.lock (if available)
COPY package*.json yarn.lock* ./

# Copy the rest of the application code
COPY . .

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

ENV NODE_ENV=production

# Build the application (if needed)
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["yarn", "start"]