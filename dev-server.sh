#!/bin/bash

# ===================================
# TravelerAIgent Development Server
# ===================================
# This script starts the development server using nvm
# and handles port configuration according to .env

# Load environment variables
set -a
source .env
set +a

# Extract port from AUTH_URL if PORT is not set
if [ -z "$PORT" ] && [[ "$AUTH_URL" =~ :([0-9]+) ]]; then
    PORT=${BASH_REMATCH[1]}
elif [ -z "$PORT" ]; then
    PORT=3000  # Default port if not specified
fi

# Function to check if port is in use
is_port_in_use() {
    lsof -i :$1 >/dev/null 2>&1
    return $?
}

# Function to kill process using port
kill_process_on_port() {
    echo "Port $PORT is in use. Attempting to free the port..."
    local pid=$(lsof -ti :$PORT)
    if [ -n "$pid" ]; then
        echo "Killing process $pid using port $PORT..."
        kill -9 $pid
        sleep 1  # Give it a moment to terminate
    fi
}

# Check if nvm is installed
if [ -z "$NVM_DIR" ]; then
    echo "nvm not found. Please install nvm first."
    echo "Visit https://github.com/nvm-sh/nvm#installing-and-updating for installation instructions."
    exit 1
fi

# Load nvm
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Check if .nvmrc exists
if [ -f ".nvmrc" ]; then
    echo "Found .nvmrc. Ensuring correct Node.js version..."
    nvm use
else
    echo "No .nvmrc found. Using default Node.js version..."
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "node_modules not found. Running npm install..."
    npm install
fi

# Check if port is in use
if is_port_in_use $PORT; then
    kill_process_on_port
    # Check again if port is still in use
    if is_port_in_use $PORT; then
        echo "Failed to free port $PORT. Please close the application using this port and try again."
        exit 1
    fi
fi

# Start the development server
echo "Starting development server on port $PORT..."
echo "Using AUTH_URL: $AUTH_URL"
echo "Using NEXTAUTH_URL: $NEXTAUTH_URL"

# Run the dev server
npm run dev -- --port $PORT

echo "Development server stopped."
