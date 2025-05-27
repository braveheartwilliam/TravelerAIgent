import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 65480;
const BASE_URL = `http://localhost:${PORT}`;

async function testDashboard() {
  try {
    console.log(`Testing dashboard at: ${BASE_URL}/__protected__/dashboard`);
    
    // First, try to access the dashboard without authentication
    console.log('\n--- Testing unauthenticated access ---');
    try {
      const response = await fetch(`${BASE_URL}/__protected__/dashboard`);
      console.log(`Status: ${response.status} ${response.statusText}`);
      if (response.redirected) {
        console.log(`Redirected to: ${response.url}`);
      }
      const data = await response.text();
      console.log('Response:', data.substring(0, 500) + (data.length > 500 ? '...' : ''));
    } catch (error) {
      console.error('Error testing unauthenticated access:', error.message);
    }

    // Note: In a real test, you would need to authenticate first
    // and then use the session cookie to test authenticated access
    
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testDashboard();
