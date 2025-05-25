# Task Request

## Project Context
- **Project Name**: [Project Name]
- **Current State**: Early Development
- **Relevant Files**: Database schemas

## Task Description
This is the current PostGres tables and columns names and details 

## Requirements
- user table 
Columns in users table:
┌─────────┬──────────────────────────┬───────────────────────────────┬─────────────┬─────────────────────────────────────┐
│ (index) │ column_name              │ data_type                     │ is_nullable │ column_default                      │
├─────────┼──────────────────────────┼───────────────────────────────┼─────────────┼─────────────────────────────────────┤
│ 0       │ 'reset_password_expires' │ 'timestamp without time zone' │ 'YES'       │ null                                │
│ 1       │ 'address_coords'         │ 'jsonb'                       │ 'YES'       │ null                                │
│ 2       │ 'email_verified'         │ 'timestamp without time zone' │ 'YES'       │ null                                │
│ 3       │ 'reset_token_expires'    │ 'timestamp without time zone' │ 'YES'       │ null                                │
│ 4       │ 'role'                   │ 'USER-DEFINED'                │ 'NO'        │ "'user'::user_role"                 │
│ 5       │ 'is_active'              │ 'boolean'                     │ 'NO'        │ 'true'                              │
│ 6       │ 'last_login'             │ 'timestamp without time zone' │ 'YES'       │ null                                │
│ 7       │ 'created_at'             │ 'timestamp without time zone' │ 'NO'        │ 'now()'                             │
│ 8       │ 'updated_at'             │ 'timestamp without time zone' │ 'NO'        │ 'now()'                             │
│ 9       │ 'id'                     │ 'integer'                     │ 'NO'        │ "nextval('users_id_seq'::regclass)" │
│ 10      │ 'state'                  │ 'text'                        │ 'YES'       │ null                                │
│ 11      │ 'postal_code'            │ 'text'                        │ 'YES'       │ null                                │
│ 12      │ 'country'                │ 'text'                        │ 'YES'       │ null                                │
│ 13      │ 'reset_password_token'   │ 'text'                        │ 'YES'       │ null                                │
│ 14      │ 'github_id'              │ 'text'                        │ 'YES'       │ null                                │
│ 15      │ 'verification_token'     │ 'text'                        │ 'YES'       │ null                                │
│ 16      │ 'reset_token'            │ 'text'                        │ 'YES'       │ null                                │
│ 17      │ 'userName'               │ 'text'                        │ 'NO'        │ null                                │
│ 18      │ 'email'                  │ 'text'                        │ 'NO'        │ null                                │
│ 19      │ 'password'               │ 'text'                        │ 'YES'       │ null                                │
│ 20      │ 'fullName'               │ 'text'                        │ 'YES'       │ null                                │
│ 21      │ 'profile_picture'        │ 'text'                        │ 'YES'       │ null                                │
│ 22      │ 'phone'                  │ 'text'                        │ 'YES'       │ null                                │
│ 23      │ 'street'                 │ 'text'                        │ 'YES'       │ null                                │
│ 24      │ 'apt'                    │ 'text'                        │ 'YES'       │ null                                │
│ 25      │ 'city'                   │ 'text'                        │ 'YES'       │ null                                │

- [ ] Requirement 2
- [ ] Requirement 3

## Technical Details
- **Framework**: [e.g., SvelteKit, React, etc.]
- **Dependencies**: [Any specific versions or new packages]
- **Environment**: [Development/Production, any specific configs]

## Expected Behavior
[Describe what should happen when the task is complete]

## Potential Challenges
[Any known issues or concerns to be aware of]

## Additional Context
[Any other relevant information, links, or references]

## Testing Instructions
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Rollback Plan
[Steps to undo changes if something goes wrong]

---

### Example:

```markdown
# Task Request

## Project Context
- **Project Name**: TravelAIgent
- **Current State**: Working on authentication flow, signup page has a 500 error
- **Relevant Files**: 
  - `src/routes/auth/signup/+page.server.ts`
  - `src/routes/auth/signup/+page.svelte`

## Task Description
Fix the 500 error on the signup page when submitting the form.

## Requirements
- [ ] Form should validate input
- [ ] User should be created in the database
- [ ] Auto-login after successful signup

## Technical Details
- **Framework**: SvelteKit
- **Dependencies**: better-auth, drizzle-orm
- **Environment**: Development

## Expected Behavior
1. User fills out signup form
2. On submit, data is validated
3. New user is created in database
4. User is logged in and redirected to dashboard

## Potential Challenges
- Database connection issues
- Password hashing
- Session management
```
