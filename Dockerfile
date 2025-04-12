# Use the official Node.js LTS base image
FROM node:20

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy app source
COPY . .

# Expose port Cloud Run expects
EXPOSE 8080

# Start the app
CMD [ "node", "index.js" ]
