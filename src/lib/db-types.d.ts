import { PgColumn, PgTableWithColumns } from 'drizzle-orm/pg-core';
import { users } from './server/schema';

declare module 'drizzle-orm/pg-core' {
  interface PgTableWithColumns<T extends TableConfig> {
    userName: PgColumn<{ name: 'userName' }>;
  }
}

// Export the users table type with userName
export type UsersTable = typeof users;
