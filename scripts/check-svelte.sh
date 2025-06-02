#!/bin/bash

# Script to run svelte-check on specific directories or files
# Usage: ./scripts/check-svelte.sh [directory or file path]

# Get the project root directory (where this script is located)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && cd .. && pwd)"
TSCONFIG_PATH="$PROJECT_ROOT/tsconfig.json"

# Create a temporary directory for checking a specific file if needed
TEMP_DIR=""

# Function to clean up temporary directory
cleanup() {
  if [ -n "$TEMP_DIR" ] && [ -d "$TEMP_DIR" ]; then
    rm -rf "$TEMP_DIR"
  fi
}

# Set up trap to clean up on exit
trap cleanup EXIT

# Check if we're checking a specific file
if [[ -f "$PROJECT_ROOT/$1" ]]; then
  # Create a temporary directory structure for the file
  TEMP_DIR=$(mktemp -d)
  FILE_PATH="$1"
  FILE_DIR=$(dirname "$FILE_PATH")
  FILE_NAME=$(basename "$FILE_PATH")
  
  # Create the directory structure in the temp dir
  mkdir -p "$TEMP_DIR/$FILE_DIR"
  
  # Copy the file to the temp directory
  cp "$PROJECT_ROOT/$FILE_PATH" "$TEMP_DIR/$FILE_DIR/"
  
  # Set the target path to the temp directory
  TARGET_PATH="$TEMP_DIR"
  DISPLAY_PATH="$FILE_PATH"
else
  # Default to checking the specified directory or src if none provided
  TARGET_PATH=${1:-"src"}
  DISPLAY_PATH="$TARGET_PATH"
fi

echo "Running svelte-check on: $DISPLAY_PATH"
echo "======================================"

# Run svelte-kit sync first to ensure routes are up to date
npx svelte-kit sync

# Run svelte-check with optimized options on the specified path
npx svelte-check --tsconfig "$TSCONFIG_PATH" \
  --threshold warning \
  --fail-on-warnings=false \
  --ignore "**/*.spec.js,**/*.test.js" \
  --workspace "$TARGET_PATH"

exit_code=$?

if [ $exit_code -eq 0 ]; then
  echo "✅ Svelte check completed successfully!"
else
  echo "⚠️ Svelte check found issues. See above for details."
fi

exit $exit_code
