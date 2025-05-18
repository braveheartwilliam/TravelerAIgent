# Star Rating System Implementation Documentation

## Overview

This document details the implementation of the star rating system for travel accommodations, transportation, and activities. The system includes functionality for users to rate their experiences, submit text reviews, view aggregated ratings, and receive automated notifications for pending reviews.

## System Architecture

The rating system follows a layered architecture:

1. **Database Layer**: Stores ratings, reviews, and notification data
2. **Service Layer**: Handles business logic including rating calculations and notification generation
3. **API Layer**: Provides endpoints for frontend components
4. **UI Layer**: Renders star ratings, review forms, and notifications

## Database Schema Changes

### Added Tables

1. **user_ratings**
   - `id`: Primary key
   - `userId`: Reference to users table
   - `entityType`: String (lodging, transportation, experience)
   - `entityId`: ID of the rated entity
   - `rating`: Numeric (1-5 stars)
   - `review`: Text review
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

2. **rating_summaries**
   - `id`: Primary key
   - `entityType`: String (lodging, transportation, experience)
   - `entityId`: ID of the entity
   - `averageRating`: Average star rating
   - `reviewCount`: Total number of reviews
   - `star1Count`: Count of 1-star ratings
   - `star2Count`: Count of 2-star ratings
   - `star3Count`: Count of 3-star ratings
   - `star4Count`: Count of 4-star ratings
   - `star5Count`: Count of 5-star ratings
   - `updatedAt`: Last calculation time

3. **notification_settings**
   - `id`: Primary key
   - `userId`: Reference to users table
   - `emailNotifications`: Boolean
   - `pushNotifications`: Boolean
   - `inAppNotifications`: Boolean
   - `dailyDigest`: Boolean
   - `weeklyDigest`: Boolean
   - `notificationTime`: Time of day for notifications
   - `reminderDaysBefore`: Days before to remind
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

4. **notifications**
   - `id`: Primary key
   - `userId`: Reference to users table
   - `title`: Notification title
   - `message`: Notification message
   - `type`: Notification type
   - `urgency`: Notification urgency level
   - `isRead`: Boolean
   - `isDismissed`: Boolean
   - `relatedType`: Type of related entity
   - `relatedId`: ID of related entity
   - `tripId`: Reference to trips table
   - `createdAt`: Timestamp
   - `updatedAt`: Timestamp

## Modified Tables

1. **experiences**
   - Added `status` field with values: planning, confirmed, paid, completed
   - Added `rating` field to store average rating
   - Associated with user_ratings via entityId

2. **lodging**
   - Added `status` field with values: planning, confirmed, paid, completed
   - Added `rating` field to store average rating
   - Associated with user_ratings via entityId

3. **transportation**
   - Added `status` field with values: planning, confirmed, paid, completed
   - Added `rating` field to store average rating
   - Associated with user_ratings via entityId

## Server Components

### Services

1. **`ratings-service.ts`**
   - Handles CRUD operations for ratings
   - Calculates and updates rating summaries
   - Provides methods for querying ratings by entity or user

2. **`notification-service.ts`**
   - Creates and manages notifications
   - Handles notification preferences
   - Provides methods for marking notifications as read/dismissed

3. **`job-scheduler.ts`**
   - Manages scheduled tasks
   - Runs the review reminder job
   - Checks for completed items without ratings
   - Contains logic for notification generation

### API Routes

1. **`ratings-routes.ts`**
   - `POST /api/ratings`: Create or update a rating
   - `GET /api/ratings/:entityType/:entityId`: Get ratings for an entity
   - `GET /api/ratings/user`: Get all ratings by current user
   - `GET /api/ratings/summary/:entityType/:entityId`: Get rating summary
   - `DELETE /api/ratings/:ratingId`: Delete a rating

2. **`notification-routes.ts`**
   - `GET /api/notifications`: Get user notifications
   - `PATCH /api/notifications/:id`: Update notification status
   - `GET /api/notifications/settings`: Get notification settings
   - `PUT /api/notifications/settings`: Update notification settings

## Job Scheduler Implementation

The job scheduler was implemented as a singleton class that manages scheduled tasks. The most critical function for the rating system is the review reminder job:

### Review Reminder Job

The job scheduler runs daily and:

1. Retrieves all active users
2. For each user, checks their notification preferences
3. Gets all trips for the user
4. For each trip:
   - Checks experiences with past dates
   - Checks lodgings with past checkout dates
   - Checks transportation with past arrival dates
5. For each item found:
   - Verifies if the user has already submitted a rating
   - Checks if the user has opted out of reminders
   - Creates a notification if needed

### Key Fixes in Job Scheduler

A critical fix was implemented in the lodging check function:

#### Original Issue
The original code incorrectly tried to query lodgings directly by `tripId`, but the lodging table doesn't have a direct reference to trips. Instead, lodgings are associated with destinations, which are then associated with trips.

#### Solution
1. First query all destinations for a trip
2. Extract destination IDs from the results
3. Query lodgings using `inArray` to match by destination IDs

```typescript
// First get all destinations for this trip
const destinationsQuery = db
  .select()
  .from(destinations)
  .where(eq(destinations.tripId, tripId));

const tripDestinations = await destinationsQuery;

// Get destination IDs for this trip
const destinationIds = tripDestinations.map(d => d.id);

// Get lodgings associated with these destinations
const lodgingsQuery = db
  .select()
  .from(lodging)
  .where(
    and(
      inArray(lodging.destinationId, destinationIds),
      lt(lodging.checkOutTime, now) // Checkout date is in the past
    )
  );
```

## Notification System

The notification system was enhanced to handle review reminders:

1. **Types of notifications**:
   - `review_reminder`: Reminds user to rate a completed item
   - `rating_updated`: Notifies when a rating has been updated

2. **User Opt-Out Capability**:
   - Users can opt out of reminders for specific items
   - Implemented using special entries in `user_ratings` table with types like `experience_opt_out`

3. **Notification Management**:
   - Users can view all notifications in a notification center
   - Notifications can be marked as read or dismissed
   - User preferences control which notification channels are used

## UI Components

1. **Star Rating Component**:
   - Reusable component for displaying and inputting star ratings
   - Supports read-only and interactive modes
   - Shows hover states for interactive ratings

2. **Review Form Component**:
   - Text area for detailed reviews
   - Character count and validation
   - Submit/cancel buttons

3. **Notification Badge Component**:
   - Displays unread notification count
   - Dropdown menu for viewing recent notifications
   - Quick actions for dismissal or navigation

4. **Rating Summary Component**:
   - Visual display of average rating
   - Bar chart showing distribution of ratings
   - Count of total reviews

## Error Handling and Debugging

The implementation includes comprehensive error handling:

1. **Database Query Logging**:
   - All SQL queries are logged with their parameters
   - Raw SQL is captured for debugging complex queries

2. **Try-Catch Blocks**:
   - Each critical operation is wrapped in try-catch
   - Detailed error logging with context information
   - Graceful degradation when errors occur

3. **Data Validation**:
   - Input validation using Zod schemas
   - Type checking with TypeScript
   - Required field verification

## Testing Considerations

For testing the implemented rating system:

1. **Create test data**:
   - Set up trips with destinations, lodgings, transportation, and experiences
   - Set past dates for items that should trigger review reminders

2. **Verify review reminders**:
   - Check that notifications are created for past-dated items
   - Verify that opt-out mechanism works correctly
   - Test with various user notification preferences

3. **Test rating functionality**:
   - Submit ratings for different entity types
   - Update existing ratings
   - Check that rating summaries are calculated correctly

4. **Performance testing**:
   - Test with a large number of users and trips
   - Verify that the job scheduler can handle the workload
   - Check database query performance

## Debugging Common Issues

### Job Scheduler Errors

1. **SQL Syntax Errors**:
   - Check the logged raw SQL for syntax issues
   - Verify that all table and column names match the database schema
   - Ensure that relationships between tables are correctly defined

2. **Missing Table Columns**:
   - Verify that all expected columns exist in the database tables
   - Check for snake_case vs. camelCase mismatches
   - Use table introspection queries to confirm schema

3. **Notification Creation Failures**:
   - Check for missing user settings
   - Verify that all required notification fields are provided
   - Check for foreign key constraints

## File Changes Summary

### New Files:

1. `server/services/ratings-service.ts`
2. `server/services/notification-service.ts`
3. `server/services/job-scheduler.ts`
4. `server/ratings-routes.ts`
5. `client/src/components/ui/star-rating.tsx`
6. `client/src/components/ui/notification-badge.tsx`
7. `client/src/components/trips/ExperienceRating.tsx`
8. `client/src/components/trips/LodgingRating.tsx`
9. `client/src/components/trips/TransportationRating.tsx`
10. `migrations/add_rating_tables.js`

### Modified Files:

1. `shared/schema.ts` - Added rating and notification schemas
2. `server/index.ts` - Added routes and job scheduler initialization
3. `server/routes.ts` - Integrated rating routes
4. `client/src/components/trips/ExperienceForm.tsx` - Added rating component
5. `client/src/components/trips/LodgingForm.tsx` - Added rating component
6. `client/src/components/trips/TransportationForm.tsx` - Added rating component
7. `client/src/components/trips/TripDetails.tsx` - Added rating displays
8. `client/src/components/layout/MainLayout.tsx` - Added notification badge
9. `client/src/api/index.ts` - Added rating API endpoints

## Future Enhancements

1. **Analytics Dashboard**:
   - Add visualization of rating trends over time
   - Provide insights on most/least popular items

2. **Recommendation Engine**:
   - Use ratings to improve recommendations
   - Highlight highly-rated options during trip planning

3. **Social Features**:
   - Allow users to share their ratings and reviews
   - Implement upvoting/helpfulness marks for reviews

4. **Advanced Filtering**:
   - Filter search results by minimum rating
   - Sort by rating or review count

## Conclusion

The implementation of the star rating system provides a comprehensive solution for users to rate and review their travel experiences. The job scheduler ensures timely reminders for pending reviews, while the notification system keeps users engaged with the platform. The modular architecture allows for future extensions and improvements to the rating functionality.