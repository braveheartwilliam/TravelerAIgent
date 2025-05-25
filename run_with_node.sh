#!/bin/bash

# Set the path to include Homebrew Node.js
export PATH="/opt/homebrew/opt/node@23/bin:$PATH"

# Verify Node.js and npm are accessible
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"

# Install dependencies
echo "Installing dependencies..."
npm install

# Run type check
echo "Running type check..."
npm run check

# Start the development server
echo "Starting development server..."
npm run dev
