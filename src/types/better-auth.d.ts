declare module 'better-auth' {
  import { Pool } from 'pg';
  
  export interface BetterAuthOptions {
    database: {
      dialect: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
      connection: Pool | any;
    };
    secret: string;
    baseUrl: string;
    session?: {
      maxAge?: number;
      updateAge?: number;
    };
    debug?: boolean;
  }

  export interface BetterAuth {
    handler: (request: Request) => Promise<Response>;
    options: BetterAuthOptions;
  }

  export function betterAuth(options: BetterAuthOptions): BetterAuth;
}

declare module 'better-auth/integrations/svelte-kit' {
  import { BetterAuthOptions, BetterAuth } from 'better-auth';
  
  export function toSvelteKitHandler(auth: {
    handler: BetterAuth['handler'];
    options: BetterAuthOptions;
  }): (event: { request: Request; url: URL }, resolve: (event: any) => any) => Promise<Response>;
}
