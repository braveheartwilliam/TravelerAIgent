import { createHash } from 'node:crypto';

// Function to hash password with salt
function hashPassword(password, salt) {
  return createHash('sha256')
    .update(password + salt)
    .digest('hex');
}

// New password for admin
const newPassword = 'admin123';
const salt = '336f9d53aa9c2fb3771564418eece5ae'; // Keep the existing salt
const hashedPassword = hashPassword(newPassword, salt);

console.log('UPDATE users SET password = $1 WHERE email = \'admin@admin.com\';', hashedPassword);
console.log('New password hash:', hashedPassword);
console.log('New password:', newPassword);
