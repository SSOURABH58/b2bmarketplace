FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Build the application
RUN npm run build

RUN npm run seed

# Expose the Next.js port (default 3000)
EXPOSE 3000

# Run the application
CMD ["npm", "start"]