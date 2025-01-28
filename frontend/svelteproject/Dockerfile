# Use the appropriate node image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if applicable)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's source code
COPY . .  

# Expose the port the app runs on
EXPOSE 5555

# Start the app
CMD ["npm", "run", "start"]
