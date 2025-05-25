#!/bin/bash

# Set the path to Node.js
export PATH="/opt/homebrew/opt/node@23/bin:$PATH"

# Run the npm commands
npm install
npm run check
npm run dev
