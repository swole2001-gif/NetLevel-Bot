FROM node:20-bookworm

WORKDIR /app

# Install system dependencies needed for canvas graphics
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy package management files
COPY package*.json ./

# Install all project dependencies
RUN npm install

# Copy the rest of the bot's files
COPY . .

# Generate the database engine mapping
RUN npx prisma generate

# Compile the TypeScript files into pure JavaScript
RUN npx tsc

# Start the bot directly using the developer's original build folder
CMD ["node", "dist/index.js"]
