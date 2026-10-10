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

# Install ts-node globally
RUN npm install -g ts-node typescript

# Install all project dependencies
RUN npm install

# Copy the rest of the bot's files
COPY . .

# Generate the database engine mapping
RUN npx prisma generate

# Deploy commands first, then start the main bot process safely
CMD ["ts-node", "--transpile-only", "src/index.ts"]
