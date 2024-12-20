# Use official Node.js image as a base
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port your application runs on
EXPOSE 8000

# Set the environment variables (optional, you can also use an .env file)
ENV KEYCLOAK_PUBLISHED_PORT=8080
ENV CLIENT_ID=poc-client
ENV CLIENT_SECRET=0427f0fd-197a-412e-a036-a40136680831
ENV ENVOY_PUBLISHED_PORT=10000

# Command to run the application(# -->use "node" for running the specfic file)
CMD ["node", "client.js"]   


