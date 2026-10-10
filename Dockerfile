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

# Install ts-node globally so we can run typescript files directly
RUN npm install -g ts-node typescript

# Install all project dependencies
RUN npm install

# Copy the rest of the bot's files
COPY . .

# Start the bot directly using ts-node to bypass compilation errors
CMD ["ts-node", "--transpile-only", "src/index.ts"]

