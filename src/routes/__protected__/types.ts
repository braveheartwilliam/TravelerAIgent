import type { User } from '$lib/types';

export interface PageData {
  user?: User;
  session?: {
    user?: User;
  };
}
