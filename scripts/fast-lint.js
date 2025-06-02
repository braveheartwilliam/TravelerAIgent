#!/usr/bin/env node

/**
 * A lightweight alternative to svelte-check that uses ESLint to check Svelte files
 * This is less comprehensive but much faster and less likely to lock up
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the file or directory to check
const targetPath = process.argv[2] || 'src';
const projectRoot = path.resolve(__dirname, '..');
const fullPath = path.resolve(projectRoot, targetPath);

console.log(`Running fast lint on: ${targetPath}`);
console.log('======================================');

try {
  // Check if the path exists
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: Path does not exist: ${fullPath}`);
    process.exit(1);
  }

  // Build the ESLint command - we use the same command for files and directories
  // as ESLint can handle both
  const command = `npx eslint "${fullPath}" --ext .svelte,.js,.ts`;

  // Run the command
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
  
  console.log('✅ Linting completed successfully!');
  process.exit(0);
} catch {
  // We don't use the error object
  console.error('⚠️ Linting found issues. See above for details.');
  process.exit(1);
}
