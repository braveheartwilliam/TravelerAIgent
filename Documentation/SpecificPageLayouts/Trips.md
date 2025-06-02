
## Trips

### Transportation Booking System Introduction

- This application's primary goal is to help a user of the application plan and manage their travel plans. The trip is the concept that is used to consolidate all aspects of the user's travel plans. Using trips, the user creates an itinerary for the trip by specifying the destinations, lodging, transportation, travelers, and other details. The user will assign dates and/or durations to each destination. Those dates will then determine the order in which the destinations will be visited and thus the itinerary.

## Definitions

### Trip

- Trips are the main way to organize and manage travel plans.
- Trips can be created and edited by the user.
- Trips can be deleted by the user.
- Trips can be shared with other users (companions and non-travelers).
- Trips are composed of Destinations, Transportation and Travelers (the trip creator and all traveling companions).
- There are 4 types of trips: Land Cruises, Ship Cruises, Guided Trips and user planned trips.
- All trips have a start date and end date.
- All trips have a status (draft, in progress, completed, cancelled, on hold, deleted).
- All trips have a budget.
- All trips have a description.
- All trips have Three or more destinations: by default the first destination is the starting point (Home unless specified otherwise) and the last destination is the ending point (Home unless specified otherwise).

### Destination

- A destination can be a city, or a place of interest (attraction, landmark, etc) or a port (train, bus, airport, seaport, etc) but must be a real place, an address, and have a valid latitude and longitude (either provided by the user or geocoded from an address by the application).
- A destination must have a description, a start date and an end date.
- A destination can have a duration in days.
- A destination can have a budget.
- A destination can have a status (draft, in progress, completed, cancelled, on hold, deleted).
- A destination can have a type (city, place of interest, port).

#### Transportation Booking Implementation Details

- Transportation is the means of transportation used to travel from one destination to another.
- Transportation can be a car, bus, train, plane, boat, etc.
- Transportation can be scheduled or on demand.
- Transportation can be shared or private.
- Transportation can be paid or free.

#### Activities Booking Implementation Details

- Activities are the things that the traveler will do at the destination.
- Activities can be paid or free.
- Activities can be scheduled or on demand.
- Activities can be shared or private.

#### Lodging Reservations Implementation Details

- Lodging is the place where the traveler will stay at the destination.
- Lodging can be paid or free.
- Lodging can be scheduled or on demand.
- Lodging can be shared or private.

### Traveler

- Traveler is a person who is traveling with the trip.
- Traveler can be the trip creator or a companion.
- Traveler can be a user or a non-user.

### User

- User is a person who is using the application.
- User can create and manage trips.
- User can share trips with other users.
- User can invite companions to join the trip.

### Companion

- Companion is a person who is traveling with the trip.
- Companion can be a user or a non-user.

### Non-User

- Non-user is a person who is not using the application.
- Non-user can be a companion or a traveler.

## Trip Types

### Land Cruise

- Land Cruise is a trip that is planned and executed on land. It is a trip that is planned and executed by a guide or a travel planner or a travel company. It already has a set itinerary and a set of destinations. It is paid for in full by the user and therefore the user is not responsible for many of the expenses associated with the trip outside of the cost of the trip.

### Ship Cruise

- Ship Cruise is a trip that is planned and executed on a ship. It already has a set itinerary and a set of destinations. It is paid for in full by the user and therefore the user is not responsible for many of the expenses associated with the trip outside of the cost of the trip.

### Guided Trip

- Guided Trip is a trip that is planned and executed by a guide. It already has a set itinerary and a set of destinations. It is paid for in full by the user and therefore the user is not responsible for many of the expenses associated with the trip outside of the cost of the trip.

### User Planned Trip

- User Planned Trip is a trip that is planned and executed by the user. The user establishes the destinations, transportation, lodging, and other details of the trip. The user is responsible for all expenses associated with the trip.

## Trip Rules

- Trips must have a start date and an end date.
- Trips must have a budget.
- Trips must have a description.
- Trips must have a status (draft, in progress, completed, cancelled, on hold, deleted).
- Trips must have a type (land cruise, ship cruise, guided trip, user planned trip).    - Trips must have a start location and an end location. The start and end location will be considered "destinations" and will be the first and last destination in the trip.  The start location will be the starting point of the trip and the end location will be the ending point of the trip.  The start location will be the user's home location unless specified otherwise.  The end location will be the user's home location unless specified otherwise. The starting Destination's arrival date/time and departure date/time will be the start date/time of the trip.  The ending Destination's arrival date/time and departure date/time will be the end date/time of the trip.
- The application will automatically create the start and end Destinations when a trip is created.
- For a land cruise, ship cruise, or guided trip, the start and end locations will be the ports of departure and arrival.  For a user planned trip, the start and end locations will be the user's home location.
- For every Destination, by default there must be lodging, transportation to and from the destination, and, optionally, activities. The user has the ability to modify or delete any of these elements.

- trips can be a collection of land cruises, ship cruises, guided trips, and user planned trips. The user can create a trip of any type. The user can also create a trip that is a collection of land cruises, ship cruises, guided trips, and user planned trips.

- a "land cruise", "ship cruise", or "guided trip" are special types of trips that can be inserted into a user planned trip. The user can insert a "land cruise", "ship cruise", or "guided trip" into a user planned trip at any point in the itinerary.

- a "land cruise", "ship cruise", or "guided trip" are special types of trips that have unique additional data and functionality. Each may have payment schedules with the need to track full payment history and payment schedules (deposit, interim payments, outstanding balance, etc). Also, there are booking numbers, confirmation numbers, and other unique identifiers that are associated with the trip. Ship Cruises have stateroom numbers, cabin numbers, and other unique identifiers.

### Trip Data Fields

- Trips must have a name, start date, end date, and a description.
- Trips must have a budget.
- Trips must have a status (draft, in progress, completed, cancelled, on hold, deleted).
- Trips must have a type (land cruise, ship cruise, guided trip, user planned trip).
- Trips must have a start location and an end location. The start and end location will be considered "destinations" and will be the first and last destination in the trip.  The start location will be the starting point of the trip and the end location will be the ending point of the trip.  The start location will be the user's home location unless specified otherwise.  The end location will be the user's home location unless specified otherwise. The starting Destination's arrival date/time and departure date/time will be the start date/time of the trip.  The ending Destination's arrival date/time and departure date/time will be the end date/time of the trip.
- The application will automatically create the start and end Destinations when a trip is created.
- For a land cruise, ship cruise, or guided trip, the start and end locations will be the ports of departure and arrival.  For a user planned trip, the start and end locations will be the user's home location.
- For every Destination, by default there must be lodging, transportation to and from the destination, and, optionally, activities. The user has the ability to modify or delete any of these elements.

- trips can be a collection of land cruises, ship cruises, guided trips, and user planned trips. The user can create a trip of any type. The user can also create a trip that is a collection of land cruises, ship cruises, guided trips, and user planned trips.

- a "land cruise", "ship cruise", or "guided trip" are special types of trips that can be inserted into a user planned trip. The user can insert a "land cruise", "ship cruise", or "guided trip" into a user planned trip at any point in the itinerary.

- a "land cruise", "ship cruise", or "guided trip" are special types of trips that have unique additional data and functionality. Each may have payment schedules with the need to track full payment history and payment schedules (deposit, interim payments, outstanding balance, etc). Also, there are booking numbers, confirmation numbers, and other unique identifiers that are associated with the trip. Ship Cruises have stateroom numbers, cabin numbers, and other unique identifiers.

### Trip Data Fields

- Trips must have a title, start date, end date, and a description.
- Trips will have either a "public" or "private" designation.  Only the user creating a trip can access a private trip.
- the user creating a trip can share a trip with other users.  The user can share a trip with other users by inviting them to the trip.  The user can also share a trip with other users by making the trip public.
- Travelers are the people that are actually traveling with the trip.  Travelers can be the trip creator or a companion.  Travelers can be a user or a non-user.
- Trips must have a budget.  The budget is the total cost of the trip.  There will be two budget values.  One is the total budgeted cost of the trip.  The second is the actual budgeted cost of the trip which is calculated from the sum of the budgets (in US dollars) of the Destinations, Transportation, Lodging, and Activities in the trip.  The budget will be in US dollars.  But, Budgets for Destinations, Transportation, Lodging, and Activities will be in the currency of the destination AND converted to US dollars.
- Trips must have a status (draft, in progress, completed, cancelled, on hold, deleted).
- Trips must have a type (land cruise, ship cruise, guided trip, user planned trip).
- Trips must have a start location and an end location. The start and end location will be considered "destinations" and will be the first and last destination in the trip.  The start location will be the starting point of the trip and the end location will be the ending point of the trip.  The start location will be the user's home location unless specified otherwise.  The end location will be the user's home location unless specified otherwise. The starting Destination's arrival date/time and departure date/time will be the start date/time of the trip.  The ending Destination's arrival date/time and departure date/time will be the end date/time of the trip.
- The application will automatically create the start and end Destinations when a trip is created.
- For a land cruise, ship cruise, or guided trip, the start and end locations will be the ports of departure and arrival.  For a user planned trip, the start and end locations will be the user's home location.
- For every Destination, by default there must be lodging, transportation to and from the destination, and, optionally, activities. The user has the ability to modify or delete any of these elements.

- Trips have a status (draft, in progress, completed, cancelled, on hold, deleted).

## Destinations

### Transportation Booking System Introduction

- Destinations are the locations that the user will visit during the trip.
- Destinations have a name, address, latitude, longitude, and a description.
- Destinations have a start date and an end date.
- Destinations have a duration in days.
- The duration in days is used to calculate the total duration of the trip.
- The duration at the destination is calculated from the start date and end date or the end date is calculated from the start date and duration in days.
- The start and end dates are used to determine the order of the destinations in the trip.
- Destinations can have a budget.
- Destinations can have a status (draft, in progress, completed, cancelled, on hold, deleted).
- Destinations have a type (city, place of interest, ship cruise port, land cruise stop, etc).

## Destination Types

### City

- A city is a destination that is a city.

### Place of Interest

- A place of interest is a destination that is a place of interest.

### Ship Cruise Port

- A ship cruise port is a destination that is a port where a ship cruise will stop.

### Land Cruise Stop

- A land cruise stop is a destination that is a stop where a land cruise will stop.

### Guided Trip Stop

- A guided trip stop is a destination that is a stop where a guided trip will stop.

### User Planned Trip Stop

- A user planned trip stop is a destination that is a stop where a user planned trip will stop.

## Destination Rules

- Destinations must have a name, address, latitude, longitude, and a description. The address must be a valid address. The latitude and longitude must be valid coordinates. If the latitude and longitude are not provided, the application will geocode the address to obtain the latitude and longitude.

- Destinations must have a start date and an end date.
- Destinations must have a duration in days.
- The duration in days is used to calculate the total duration of the trip.
- The duration at the destination is calculated from the start date and end date or the end date is calculated from the start date and duration in days.
- The start and end dates are used to determine the order of the destinations in the trip.
- Destinations must have a budget.
- Destinations must have a status (draft, in progress, completed, cancelled, on hold, deleted).
- Destinations must have a type (city, place of interest, ship cruise port, land cruise stop, etc).
- Destinations can optionally have an earliest and latest arrival date/time and an earliest and latest departure date/time.
- Destinations must have a Transportation to the Destination and from the Destination.
- When a Destination is created, the application will automatically create a Transportation from the previous Destination.  The exception is the first Destination in the Trip; it will not create a Transportation from the previous Destination.
- When a Destination is deleted, the application will delete the Transportation from the previous Destination.

## Destination Data Requirements

- name - manually entered by the user except for the default starting and ending Destinations which will be the user's home location designated "Home" or if a different location from home is specified, it will be defaulted to "Starting Point" and "Ending Point".
- type: Ship Cruise, Land Cruise, Guided Trip, User Planned Trip, Resort. For Ship Cruise, Land Cruise, Guided Trip, Extra Desinations will be automatically be generated and will have type: Embarkation Port, Disembarkation Port, Port of Call, or Stop. For User Planned Trip, Each Destination Type will have additional unique data appropriate for the type.
- address: includes street address, building number, apartment number, city, state, zip code, and country.
- latitude and longitude GPS coordinates (optional, if not provided, the application will geocode the address to obtain the latitude and longitude).
- description. For the default Destinations (start and end), the description will be "Home" unless manually changed by the user. All other descriptions will be manually entered by the user.
- arrival date and departure date.
- duration in days.
- The duration in days is used to calculate the total duration of the trip.
- The duration at the destination is calculated from the arrival date and departure date or the departure date is calculated from the start date and duration in days.

- The start and end dates are used to determine the order of the destinations in the trip.
- Destinations must have a budget.
- Destinations must have a status (draft, in progress, completed, cancelled, on hold, deleted).
- Destinations must have a type (city, place of interest, ship cruise port, land cruise stop, etc).
- Destinations can optionally have an earliest and latest arrival date/time and an earliest and latest departure date/time.

### Transportation Booking Implementation Guide

- Transportation is the means of transportation that the user will use to travel to and from the destination.

- Each Destination must have a Transportationo to the Destination and from the Destination.  The Transportation to the Destination is the transportation that the user will use to travel to the Destination.  The Transportation from the Destination is the transportation that the user will use to travel from the Destination.  The Transportation to the Destination and from the Destination can be the same type of transportation.

- The Trip's starting Destination will only have a Transportation from the Destination.  The Trip's ending Destination will only have a Transportation to the Destination.  All other Destinations will have a Transportation to the Destination and from the Destination.

- Transportation has a name, type, and a description.

- Transportation has a start date and an end date.

- Transportation has a duration in days.

- The duration in days is used to calculate the total duration of the trip.

- The duration at the destination is calculated from the start date and end date or the end date is calculated from the start date and duration in days.

- The start and end dates are used to determine the order of the transportation in the trip.

- Transportation must have a budget.

- Transportation must have a status (draft, in progress, completed, cancelled, on hold, deleted).

- Transportation must have a type (air, sea, land, etc).

- Transportation can optionally have an earliest and latest arrival date/time and an earliest and latest departure date/time.

#### Transportation Booking Interface General Requirements

- Transportation must have a name, type, and a description.

- Transportation must have a start date and an end date.

- Transportation must have a duration in days.

- The duration in days is used to calculate the total duration of the trip.

- The duration at the destination is calculated from the start date and end date or the end date is calculated from the start date and duration in days.

- The start and end dates are used to determine the order of the transportation in the trip.

- Transportation must have a budget.

- Transportation must have a status (draft, in progress, completed, cancelled, on hold, deleted).

- Transportation must have a type (air, sea, land, etc).

- Transportation can optionally have an earliest and latest arrival date/time and an earliest and latest departure date/time.

#### Transportation Booking Interface Specific Requirements

- Transportation must have a name, type, and a description.

- Transportation must have a start date and an end date.

- Transportation must have a duration in days.

- The duration in days is used to calculate the total duration of the trip.

- The duration at the destination is calculated from the start date and end date or the end date is calculated from the start date and duration in days.

- The start and end dates are used to determine the order of the transportation in the trip.

- Transportation must have a budget unless included in the cruise,  guided trip, or other prepaid trip segment.  A check box will be used to indicate if the transportation is included in the cruise,  guided trip, or other prepaid trip segment.

- Transportation must have a status (draft, in progress, completed, cancelled, on hold, deleted).

- Transportation must have a type (air, sea, land, etc).

- Transportation can optionally have an earliest and latest arrival date/time and an earliest and latest departure date/time.

#### Transportation Booking Interface Fields

- name
- description
- Types: Airplane, Train, Bus, Car, Boat, Ship, Cruise, Taxi, Ride Share.
- Departure date/time and arrival date/time.
- duration in hours.
- The duration in hours is used to calculate the total duration of the trip.
- The duration at the destination is calculated from the departure date and arrival date or the arrival date is calculated from the departure date and duration in hours.
- The start and end dates are used to determine the order of the transportation in the trip.
- Transportation must have a budget.
- Transportation must have a status (draft, in progress, completed, cancelled, on hold, deleted).
- Transportation can optionally have an earliest and latest arrival date/time and an earliest and latest departure date/time.
- Transportation must have a start location and an end location.  This would be the airport, train station, bus station, etc.
- Transportation must have a start destination and an end destination.  The destinations are derived from the Destination Name that the transportation is linked to and will be a selected from a dropdown list of Destinations (the starting or origin Destination).  The end destination will be the Destination that the transportation is linked to from the dates or manually by user selection in another dropdown list of Destinations (the ending or destination Destination).
- Transportation provider (airline, train company, bus company, etc).
- Transportation number (flight number, train number, bus number, etc).
- Transportation class (first class, business class, economy class, etc).
- Transportation fare (cost of the transportation).
- Transportation status (draft, in progress, completed, cancelled, on hold, deleted).
- Confirmation number (confirmation number from the transportation provider).
- Booking number
- Terminal, gate and other transportation details.
- Seat number
- Meal plan
- Baggage allowance
- Contact Name
- Contact Phone
- Contact Email
- Provider website

### Lodging Reservations Implementation Guide

#### Lodging Reservations Interface Overview

- Lodging is used to maintain information about the lodging for a trip.
- Each Destination must have a Lodging. Lodging details the accommodations for the Destination.

#### Lodging Reservations Interface Data Requirements

- name of accommodations facility
- type of accommodations facility (hotel, motel, vacation rental, etc)
- address of accommodations facility (includes street address, building number, apartment number, city, state, zip code, and country)
- latitude and longitude GPS coordinates (optional, if not provided, the application will geocode the address to obtain the latitude and longitude)
- description of accommodations facility
- arrival date and departure date
- duration in nights
- The duration in days should match the duration of the Destination.
- The duration at the destination is calculated from the arrival date and departure date or the departure date is calculated from the start date and duration in days.
- Lodging must have a budget.
- Lodging must have a status (draft, in progress, completed, cancelled, on hold, deleted).
- Lodging must have a type (hotel, motel, vacation rental, apartment, etc).
- Lodging can optionally have an earliest and latest arrival date/time and an earliest and latest departure date/time.
- Lodging can optionally have a check-in time and check-out time.
- cost per night
- total cost for the duration of the stay (includes tax and service fees)
- confirmation number
- booking number
- contact name
- contact phone
- contact email
- provider website
- provider phone

### Activities Booking Implementation Guide

#### Activities Booking Interface Overview

- Activities are things travelers do at destinations during their trip.

## Itinerary

### Itinerary Overview

- Each trip will have an itinerary that can be accessed by the trip creator and all traveling companions. While on a specific trip "page" the user can click on a button that will navigate to a new page that initially lists only the Destinations in the trip in the order they will be visited. There will also be a dropdown with checklist items that will allow the user to choose what else to include in the Itinerary (Transportation, Lodging, Activities, etc).

## Map

### Map Features

- Each trip will have a map that can be accessed by the trip creator and all traveling companions. The map will show the locations of the Destinations in the trip using the geocode values (latitude and longitude) of the Destinations in the order they will be visited.

## Application Navigation

### Pages accessed from the Home Page

- Each of the following pages will be organized into a Navigation bar at the top of the Home Page. The Navigation bar will allow the user to navigate to any of the pages available in the Home page header (see Home Page list of pages). Each of the page links in the Navigation bar will be a button that will navigate to the page and the buttons will be spread horizontally across the top of the Home Page (or in a vertical menu of links maybe as a dropdown for mobile devices). This Navigation bar will be fixed at the top of the Home Page and will be visible at all times. The Navigation bar will be responsive and will adjust to the screen size of the device. The Navigation bar will appear on every page in the application that makes logical sense given the context of the page.

### Trips Page

- This page will list all trips created by the user and allow the user to navigate to a specific trip page.
- This page will have a search bar that will allow the user to search for trips by name, description, or destination.
- This page will have a button that will navigate to a new page that will allow the user to create a new trip.
- This page will allow the user to delete trips using the trip list.
- This page will allow the user to edit trips using the trip list.
- This page will allow the user to share trips using the trip list.
- This page will allow the user to invite companions to join the trip using the trip list.
- This page will have a link to a new page that has a list of all trips that have been deleted BUT NOT DESTROYED. Trips can be restored OR destroyed from this list.
- This page will have a filter to select trips by several relevant criteria including trip type and trip status.

### Other Pages

- Memories page (the Memories page is the entry page to capturing, viewing, maintaining and organizing memories of a trip). This page is not designed yet so just an empty placeholder page.
- Stories page (the Stories page is the entry page to capturing, viewing, maintaining and organizing stories of a trip). This page is not designed yet so just an empty placeholder page.
- Travel Advisor page - this page will allow the user to access AI Agent assistance in planning a trip and finding destinations, transportation, lodging, activities, etc. to plan a trip. This page is not designed yet so just an empty placeholder page.
- Guided Trip page - this page will guide a new user through the steps to create a trip using a AI Agent guide. This page is not designed yet so just an empty placeholder page.

## Pages accessed from the Trips Page

### Destinations Page

- Once a trip has been created, the user can navigate to the Destinations Page to add Destinations to the trip.
- The Destinations Page will list all Destinations in the trip and allow the user to navigate to a specific Destination Page.
- The Destinations Page will have a search bar that will allow the user to search for Destinations by name, description, or destination.
- The Destinations Page will have a filter to select Destinations by several relevant criteria including destination type and destination status.
- The Destinations Page will have a button that will navigate to a new page that will allow the user to create a new Destination.
- The Destinations Page will have a button that will navigate to a new page that will allow the user to edit an existing Destination.
- The Destinations Page will have a button that will navigate to a new page that will allow the user to delete an existing Destination.
- Possibly use a dropdown next to each Destination that will allow the user to select the Transportation to the Destination and from the Destination, Activities at the Destination and/or Lodging at the Destination.

#### Transportation Booking Interface Page

- Once a trip has been created, the user can navigate to the Transportation Page to add Transportation to the trip. But, the Transportation must be associated with the "departure" and "arrival" Destinations in the trip.

#### Activities Page Details

- Once a trip has been created, the user can navigate to the Activities Page to add Activities to the trip. But, the Activities must be associated with a specific Destination in the trip.

#### Lodging Page Details

- Once a trip has been created, the user can navigate to the Lodging Page to add Lodging to the trip. But, the Lodging must be associated with a specific Destination in the trip.

## General Navigation

- Each page will have breadcrumbs that will allow the user to navigate to any of the previous pages preceding the current page navigation.
- Each page will have a Navigation Bar that will allow the user to navigate to any of the pages available in the Home page header (see Home Page list of pages).
- When editing components of a trip (Destinations, Transportation, Activities, Lodging, etc) the user will be taken to the page for that component. The user will always have a link back to the Trip page from the component page. Optionally, the user can navigate back to the Trip page from the component page using the breadcrumbs or directly to one of the component pages using a secondary navigation bar that is tailored to the specific component page.
