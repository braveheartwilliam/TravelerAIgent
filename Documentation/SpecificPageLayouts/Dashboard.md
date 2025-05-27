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

The second area {smaller font and black color} is a description of the applications main features. Here is the text for this area:

--Travel Plans: Create and manage your travel plans with ease. 
--Travel Memories: Share your travel memories with others. 
--Traveler Advisor: Get personalized travel advice based on your travel plans. 

--Stories: Read and write stories about your travel experiences. 

- Plan and manage your trips with ease and capture and organize your travel memories.

- two large buttons spread horizontally: Create Trip and Create Memory.  Create Trip opens a new page to create a new trip. Create Memory opens a new page to create a new memory.

- The third area is an invitation to be guided through the process of creating a trip or creating a memory. 

- The invitation is text that says "Click the button to start a guided creation of plans for a new trip or the capture of  a new memory." followed by a large button that says: "Let's Get Started". When clicked it opens a modal with a form to create a trip or a memory. Each button will link to a different page to create a trip or a memory.  From those pages the user will be guided through the process of creating a trip or a memory.

Finally, every page has "breadcrumbs" that show the user's current location in the application. The breadcrumbs are a horizontal row of links that show the user's current location in the application. The breadcrumbs are spread horizontally across the page and appear at the top and bottom of the second area.  Each "crumb" is clickable and returns to it's corresponding page.  




