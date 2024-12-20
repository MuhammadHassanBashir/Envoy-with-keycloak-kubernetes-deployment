FROM node
ENV SERVER_PUBLISHED_PORT=8081

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
#COPY ./server/package*.json ./
COPY package*.json ./
RUN npm install

# Copy configuration directory
COPY ./config config

# Bundle app source
#COPY ./server .
COPY . .

EXPOSE ${SERVER_PUBLISHED_PORT}
CMD [ "node", "-r", "dotenv/config", "server.js", "dotenv_config_path=./config/.env" ]