// Check available exports from better-auth
import * as betterAuth from 'better-auth';

console.log('Available exports from better-auth:');
console.log(Object.keys(betterAuth));

// Try to use the auth function if it exists
if (betterAuth.betterAuth) {
  console.log('betterAuth.betterAuth exists');
} else if (betterAuth.default) {
  console.log('better-auth has a default export');
} else {
  console.log('Could not find expected exports in better-auth');
}
