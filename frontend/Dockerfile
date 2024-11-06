# Use the official Node.js image as a base
FROM node:16

# Set the working directory to the 'frontend' folder
WORKDIR /usr/src/app/frontend

# Copy package.json and package-lock.json files if they exist
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from 'frontend' folder
COPY frontend/. .

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "server.js"]

