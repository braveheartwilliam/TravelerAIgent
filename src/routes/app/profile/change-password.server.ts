import { fail, json, type RequestEvent } from '@sveltejs/kit';
import { passwordChangeFormSchema } from '$lib/forms/superforms';
import { db } from '$lib/db';
import { users } from '$lib/server/schema';
import { hashPassword, verifyPassword } from '$lib/utils/auth';
import type { User } from '$lib/server/schema';

/**
 * POST endpoint for changing user password
 * Expects: { currentPassword, newPassword, confirmNewPassword }
 * Requires authentication
 */
export const POST = async ({ locals, request }: RequestEvent) => {
  const session = await locals.getSession?.();
  if (!session?.user?.email) {
    return fail(401, { message: 'Not authenticated' });
  }

  const body = await request.json();
  const parse = passwordChangeFormSchema.safeParse(body);
  if (!parse.success) {
    return fail(400, { errors: parse.error.flatten().fieldErrors });
  }
  const { currentPassword, newPassword } = parse.data;

  // Fetch user from DB
  const user: User | undefined = await db.query.users.findFirst({ where: (u) => u.email === session.user.email });
  if (!user || !user.password) {
    return fail(404, { message: 'User not found.' });
  }

  // Verify current password
  const valid = await verifyPassword(currentPassword, user.password);
  if (!valid) {
    return fail(400, { errors: { currentPassword: ['Current password is incorrect'] } });
  }

  // Hash new password
  const newHash = await hashPassword(newPassword);
  await db.update(users)
    .set({ password: newHash, updated_at: new Date() })
    .where(users.id.eq(user.id));

  return json({ success: true });
};
