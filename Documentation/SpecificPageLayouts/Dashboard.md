#Dashboard Page Layout

##Overview

The Dashboard page is the main page of the application. It is the first page that users see when they log in. It has a navigation bar at the top that allows users to navigate to different pages. The navigation bar has a logo on the left and a search bar on the right. The navigation bar also has a dropdown menu on the right that allows users to access their account settings and logout. It has a background image underlying the navigation bar and extends to the footer. The background image is a gradient that transitions from a dark blue to a light blue. It depicts a world map with a sun in the center and a traveler looking over the world map or a world globe. 

##Components

###Navigation Bar

The navigation bar is a fixed position at the top of the page. It has a logo on the left and a search bar on the right. The navigation bar also has a dropdown menu on the right that allows users to access their account settings and logout. The Navigation Bar is a component that is used in multiple pages.  It has the following clickable items spread horizontally across the page: Home, Trips, Memories, Map, Stories, Traveler Advisor, Traveler Insights, Profile, and Logout. Each of these items is a link to the corresponding page.The Profile page is a dropdown with several general options including: Edit Profile, Change Password, and Logout and additional options specific to the user's role including: Super Admin, Admin and User.

###Background Image

The background image is a gradient that transitions from a dark blue to a light blue. It depicts a world map with a sun in the center and a traveler looking over the world map or a world globe. 

###Footer

The footer is a fixed position at the bottom of the page. It contains the copyright information and a link to the privacy policy.

##Layout

The layout of the Dashboard page is as follows:

![Dashboard Layout](Documentation/ScreenShots/HomePage.jpg)
--Between the navigation bar and the footer is the main content area. The main content area has three main areas all vertically stacked. 
- The first area is a overview of the applications main features. Here is the text for this area:

--{large font and bold colors} Your Travel Plans and Travel Memories {next line same font different color} All in One Place.

The second area {smaller font and black text color} is a description of the applications main features. Here is the text for this area:

--Travel Plans: Create and manage your travel plans with ease. 
--Travel Memories: Share your travel memories with others. 
--Traveler Advisor: Get personalized travel advice based on your travel plans. 

--Stories: Read and write stories about your travel experiences. 

- Plan and manage your trips with ease and capture and organize your travel memories.

- two large buttons spread horizontally: Create Trip and Create Memory.  Create Trip opens a new page to create a new trip. Create Memory opens a new page to create a new memory.

- The third area is an invitation to be guided through the process of creating a trip or creating a memory. 

- The invitation is text that says "Click the button to start a guided creation of plans for a new trip or the capture of  a new memory." followed by a large button that says: "Let's Get Started". When clicked it opens a modal with a form to create a trip or a memory. Each button will link to a different page to create a trip or a memory.  From those pages the user will be guided through the process of creating a trip or a memory.

Finally, every page has "breadcrumbs" that show the user's current location in the application. The breadcrumbs are a horizontal row of links that show the user's current location in the application. The breadcrumbs are spread horizontally across the page and appear at the top and bottom of the second area.  Each "crumb" is clickable and returns to it's corresponding page.

## Clarification Questions

### Navigation
1. **Role-based Navigation**: 
   - Which navigation items should be visible for each role (Super Admin, Admin, User)?
   -- all
   - Should any menu items have different behaviors based on user role?
   -- no

### Responsive Design
2. **Mobile Behavior**:ele
   - Should the navigation collapse into a hamburger menu on mobile?
   --yes
   - How should the search bar and profile dropdown behave on smaller screens?
   --the same for now

### Search Functionality
3. **Search Implementation**:
   - What content should be searchable (trips, memories, users, etc.)?
   -- trips, memories, locations, destinations (associated with trips - specs later)
   - Should search include autocomplete/suggestions?
   --yes
   - What page should search results be displayed on?
   --modal page overlay withe selection functionality

### User Interface
4. **Profile Dropdown**:
   - Should "Edit Profile" and "Change Password" open modals or navigate to new pages?
   -- new pages
   - Should there be visual indicators for new notifications/messages?
   --yes, flashing mail icon

5. **Breadcrumbs**:
   - Could you provide example breadcrumb trails for different sections?
   -- for now use route names
   - Should breadcrumbs be clickable all the way to the home page?
   --yes

### Technical Requirements
6. **Accessibility**:
   - Are there specific WCAG compliance levels required?
   --no
   - Should all interactive elements have ARIA labels?
   --no

7. **Loading States**:
   - What should be displayed while dashboard data is loading?
   --loading spinner
   - Should there be skeleton loaders or just a simple spinner?
   --skeleton loaders

8. **Error Handling**:
   - How should the dashboard handle API failures or network errors?
   2 retries then error message and console log
   - Should there be retry mechanisms for failed requests?
   --yes

9. **Internationalization (i18n)**:
   - Which languages need to be supported initially?
   --English
   - Should the language preference be saved per user?
   --yes

10. **Analytics & Tracking**:
    - Which user interactions should be tracked?
    --all
    - Are there specific analytics platforms to integrate with?
    --no

11. **Theme Support**:
    - Should dark/light mode be supported?
    --yes
    - Should theme preference be saved per user?
    --yes

12. **Browser Support**:
    - Which browsers and versions need to be supported?
    --all
    - Are there any known compatibility requirements?
    --no

13. **Performance**:
    - Are there maximum load time requirements?
    --no
    - Should code splitting be implemented for different sections?
    --advise as to best practices

14. **Testing**:
    - Are there specific test cases that must be covered?
    --no
    - Should visual regression testing be implemented?
    --no

15. **Security**:
    - Are there specific security headers or CSP requirements?
    --no
    - Should there be rate limiting on API endpoints?
    --no

16. **Analytics/Telemetry**:
    - Should user interactions be tracked for analytics?
    --no
    - Are there specific events that need to be captured?
    -- deletions

17. **Offline Support**:
    - Should the dashboard work offline?
    --no
    - If yes, which features should be available offline?

18. **Notifications**:
    - Should there be a notification system?
    --yes
    - Should notifications be real-time or polled?
    --real-time

19. **Access Control**:
    - Should there be role-based access control (RBAC)?
    --yes
    - How should unauthorized access attempts be handled?
    --redirect to login and lock-out after x failed attempts where x set by Admin

20. **Documentation**:
    - Should there be in-app help or tooltips?
    --yes
    - Is a user guide or tutorial needed for first-time users?
    --yes
