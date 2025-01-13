# Use Node.js LTS as the base image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock) to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code, including openapi.yaml and index.ts
COPY . .

# Install Prisma client and generate it
RUN npx prisma generate

# Build the TypeScript files into JavaScript (dist folder)
RUN npm run build

# Expose the application port (default is 3000)
EXPOSE 3000

# Command to run the application in production
CMD ["npm", "start"]
