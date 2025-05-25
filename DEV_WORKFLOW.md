# Development Workflow

## Starting the Development Server

### Prerequisites
- Node.js (version specified in `.nvmrc`)
- nvm (Node Version Manager)
- PostgreSQL (for the database)

### Using the Dev Server Script

1. **Make the script executable** (only needed once):
   ```bash
   chmod +x dev-server.sh
   ```

2. **Start the development server**:
   ```bash
   ./dev-server.sh
   ```

   The script will:
   - Load environment variables from `.env`
   - Use the port specified in `PORT` or extract it from `AUTH_URL`
   - Check if the port is available and attempt to free it if necessary
   - Ensure the correct Node.js version is used (from `.nvmrc` if present)
   - Install dependencies if `node_modules` is missing
   - Start the development server

### Manual Start (Alternative)

If you prefer to start the server manually:

1. Ensure the correct Node.js version is active:
   ```bash
   nvm use
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm run dev -- --port 65480
   ```
   (Replace 65480 with your desired port if different in `.env`)

## Environment Variables

Key environment variables used by the application:

- `AUTH_URL`: Base URL for authentication (e.g., `http://localhost:65480`)
- `NEXTAUTH_URL`: NextAuth.js URL (should match `AUTH_URL`)
- `PORT`: Server port (default: 65480)
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)

## Common Issues

### Port Already in Use
If you get a port in use error:
1. The script will attempt to free the port automatically
2. If that fails, manually identify and kill the process:
   ```bash
   lsof -i :65480  # Find the process ID
   kill -9 <PID>    # Replace <PID> with the actual process ID
   ```

### Node.js Version Mismatch
If you see version-related errors:
1. Ensure you have the correct Node.js version installed:
   ```bash
   nvm install
   nvm use
   ```

### Missing Dependencies
If you see module not found errors:
```bash
npm install
```
