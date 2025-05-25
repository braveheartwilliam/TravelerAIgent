# Task Request

## Project Context
- **Project Name**: [Project Name]
- **Current State**: [Brief description of current state]
- **Relevant Files**: [List of files involved]

## Task Description
[Clear, concise description of what you want to achieve]

## Requirements
- [ ] Requirement 1
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
