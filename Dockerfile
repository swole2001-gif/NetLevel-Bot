FROM node:20-bookworm

WORKDIR /app

# Install system dependencies needed for building canvas graphics
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

# Install all dependencies
RUN npm install

# Copy the rest of the bot's files
COPY . .

# Run the build script to compile TypeScript
RUN npm run build

# Start the bot
CMD ["npm", "start"]
