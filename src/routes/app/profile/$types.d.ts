import type { LayoutServerLoad } from './$types';

export interface PageServerLoad extends LayoutServerLoad {
  (event: {
    locals: {
      getSession: () => Promise<{
        user?: {
          id: string;
          name?: string | null;
          email?: string | null;
          image?: string | null;
        } | null;
      } | null>;
    };
    url: URL;
  }): Promise<{
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    } | null;
  }>;
}
