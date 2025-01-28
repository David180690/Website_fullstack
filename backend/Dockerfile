# Use the official Node.js image as a base
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files
COPY backend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY backend/ .

# Expose the ports for both services
EXPOSE 5000 5001

# Command to run the server
CMD ["node", "server.js"]
