/**
 * Repository utilities for type conversion between database and application types
 */

// Convert string to number or null
export function toNumber(value: string | null): number | null {
  if (value === null) return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// Convert number to string or null
export function toString(value: number | null): string | null {
  if (value === null) return null;
  return value.toString();
}

// Convert nullable boolean to non-nullable boolean
export function toBoolean(value: boolean | null): boolean {
  return value === null ? false : value;
}

// Convert non-nullable boolean to nullable boolean
export function toNullableBoolean(value: boolean): boolean | null {
  return value;
}

// Convert database trip to application Trip type
export function mapDbTrip<T extends { 
  budget_planned: string | null; 
  budget_actual: string | null;
}>(dbTrip: T): Omit<T, 'budget_planned' | 'budget_actual'> & {
  budget_planned: number | null;
  budget_actual: number | null;
} {
  return {
    ...dbTrip,
    budget_planned: toNumber(dbTrip.budget_planned),
    budget_actual: toNumber(dbTrip.budget_actual)
  };
}

// Convert application Trip to database trip type
export function mapToDbTrip<T extends { 
  budget_planned: number | null; 
  budget_actual: number | null;
}>(trip: T): Omit<T, 'budget_planned' | 'budget_actual'> & {
  budget_planned: string | null;
  budget_actual: string | null;
} {
  return {
    ...trip,
    budget_planned: toString(trip.budget_planned),
    budget_actual: toString(trip.budget_actual)
  };
}

// Convert database destination to application Destination type
export function mapDbDestination<T extends { 
  latitude: string | null; 
  longitude: string | null;
  budget_planned: string | null; 
  budget_actual: string | null;
  is_start_location: boolean | null;
  is_end_location: boolean | null;
}>(dbDestination: T): Omit<T, 'latitude' | 'longitude' | 'budget_planned' | 'budget_actual' | 'is_start_location' | 'is_end_location'> & {
  latitude: number | null;
  longitude: number | null;
  budget_planned: number | null;
  budget_actual: number | null;
  is_start_location: boolean;
  is_end_location: boolean;
} {
  return {
    ...dbDestination,
    latitude: toNumber(dbDestination.latitude),
    longitude: toNumber(dbDestination.longitude),
    budget_planned: toNumber(dbDestination.budget_planned),
    budget_actual: toNumber(dbDestination.budget_actual),
    is_start_location: toBoolean(dbDestination.is_start_location),
    is_end_location: toBoolean(dbDestination.is_end_location)
  };
}

// Convert application Destination to database destination type
export function mapToDbDestination<T extends { 
  latitude: number | null; 
  longitude: number | null;
  budget_planned: number | null; 
  budget_actual: number | null;
  is_start_location: boolean;
  is_end_location: boolean;
}>(destination: T): Omit<T, 'latitude' | 'longitude' | 'budget_planned' | 'budget_actual' | 'is_start_location' | 'is_end_location'> & {
  latitude: string | null;
  longitude: string | null;
  budget_planned: string | null;
  budget_actual: string | null;
  is_start_location: boolean | null;
  is_end_location: boolean | null;
} {
  return {
    ...destination,
    latitude: toString(destination.latitude),
    longitude: toString(destination.longitude),
    budget_planned: toString(destination.budget_planned),
    budget_actual: toString(destination.budget_actual),
    is_start_location: toNullableBoolean(destination.is_start_location),
    is_end_location: toNullableBoolean(destination.is_end_location)
  };
}

// Convert database transportation to application Transportation type
export function mapDbTransportation<T extends { 
  duration_hours: string | null;
  fare: string | null;
  is_shared: boolean | null;
  is_private: boolean | null;
  is_paid: boolean | null;
  is_scheduled: boolean | null;
}>(dbTransportation: T): Omit<T, 'duration_hours' | 'fare' | 'is_shared' | 'is_private' | 'is_paid' | 'is_scheduled'> & {
  duration_hours: number | null;
  fare: number | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
} {
  return {
    ...dbTransportation,
    duration_hours: toNumber(dbTransportation.duration_hours),
    fare: toNumber(dbTransportation.fare),
    is_shared: toBoolean(dbTransportation.is_shared),
    is_private: toBoolean(dbTransportation.is_private),
    is_paid: toBoolean(dbTransportation.is_paid),
    is_scheduled: toBoolean(dbTransportation.is_scheduled)
  };
}

// Convert application Transportation to database transportation type
export function mapToDbTransportation<T extends { 
  duration_hours: number | null;
  fare: number | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
}>(transportation: T): Omit<T, 'duration_hours' | 'fare' | 'is_shared' | 'is_private' | 'is_paid' | 'is_scheduled'> & {
  duration_hours: string | null;
  fare: string | null;
  is_shared: boolean | null;
  is_private: boolean | null;
  is_paid: boolean | null;
  is_scheduled: boolean | null;
} {
  return {
    ...transportation,
    duration_hours: toString(transportation.duration_hours),
    fare: toString(transportation.fare),
    is_shared: toNullableBoolean(transportation.is_shared),
    is_private: toNullableBoolean(transportation.is_private),
    is_paid: toNullableBoolean(transportation.is_paid),
    is_scheduled: toNullableBoolean(transportation.is_scheduled)
  };
}

// Convert database lodging to application Lodging type
export function mapDbLodging<T extends { 
  latitude: string | null; 
  longitude: string | null;
  cost_per_night: string | null;
  total_cost: string | null;
  is_shared: boolean | null;
  is_private: boolean | null;
  is_paid: boolean | null;
  is_scheduled: boolean | null;
}>(dbLodging: T): Omit<T, 'latitude' | 'longitude' | 'cost_per_night' | 'total_cost' | 'is_shared' | 'is_private' | 'is_paid' | 'is_scheduled'> & {
  latitude: number | null;
  longitude: number | null;
  cost_per_night: number | null;
  total_cost: number | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
} {
  return {
    ...dbLodging,
    latitude: toNumber(dbLodging.latitude),
    longitude: toNumber(dbLodging.longitude),
    cost_per_night: toNumber(dbLodging.cost_per_night),
    total_cost: toNumber(dbLodging.total_cost),
    is_shared: toBoolean(dbLodging.is_shared),
    is_private: toBoolean(dbLodging.is_private),
    is_paid: toBoolean(dbLodging.is_paid),
    is_scheduled: toBoolean(dbLodging.is_scheduled)
  };
}

// Convert application Lodging to database lodging type
export function mapToDbLodging<T extends { 
  latitude: number | null; 
  longitude: number | null;
  cost_per_night: number | null;
  total_cost: number | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
}>(lodging: T): Omit<T, 'latitude' | 'longitude' | 'cost_per_night' | 'total_cost' | 'is_shared' | 'is_private' | 'is_paid' | 'is_scheduled'> & {
  latitude: string | null;
  longitude: string | null;
  cost_per_night: string | null;
  total_cost: string | null;
  is_shared: boolean | null;
  is_private: boolean | null;
  is_paid: boolean | null;
  is_scheduled: boolean | null;
} {
  return {
    ...lodging,
    latitude: toString(lodging.latitude),
    longitude: toString(lodging.longitude),
    cost_per_night: toString(lodging.cost_per_night),
    total_cost: toString(lodging.total_cost),
    is_shared: toNullableBoolean(lodging.is_shared),
    is_private: toNullableBoolean(lodging.is_private),
    is_paid: toNullableBoolean(lodging.is_paid),
    is_scheduled: toNullableBoolean(lodging.is_scheduled)
  };
}

// Convert database activity to application Activity type
export function mapDbActivity<T extends { 
  latitude: string | null; 
  longitude: string | null;
  cost: string | null;
  duration_hours: string | null;
  is_shared: boolean | null;
  is_private: boolean | null;
  is_paid: boolean | null;
  is_scheduled: boolean | null;
}>(dbActivity: T): Omit<T, 'latitude' | 'longitude' | 'cost' | 'duration_hours' | 'is_shared' | 'is_private' | 'is_paid' | 'is_scheduled'> & {
  latitude: number | null;
  longitude: number | null;
  cost: number | null;
  duration_hours: number | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
} {
  return {
    ...dbActivity,
    latitude: toNumber(dbActivity.latitude),
    longitude: toNumber(dbActivity.longitude),
    cost: toNumber(dbActivity.cost),
    duration_hours: toNumber(dbActivity.duration_hours),
    is_shared: toBoolean(dbActivity.is_shared),
    is_private: toBoolean(dbActivity.is_private),
    is_paid: toBoolean(dbActivity.is_paid),
    is_scheduled: toBoolean(dbActivity.is_scheduled)
  };
}

// Convert application Activity to database activity type
export function mapToDbActivity<T extends { 
  latitude: number | null; 
  longitude: number | null;
  cost: number | null;
  duration_hours: number | null;
  is_shared: boolean;
  is_private: boolean;
  is_paid: boolean;
  is_scheduled: boolean;
}>(activity: T): Omit<T, 'latitude' | 'longitude' | 'cost' | 'duration_hours' | 'is_shared' | 'is_private' | 'is_paid' | 'is_scheduled'> & {
  latitude: string | null;
  longitude: string | null;
  cost: string | null;
  duration_hours: string | null;
  is_shared: boolean | null;
  is_private: boolean | null;
  is_paid: boolean | null;
  is_scheduled: boolean | null;
} {
  return {
    ...activity,
    latitude: toString(activity.latitude),
    longitude: toString(activity.longitude),
    cost: toString(activity.cost),
    duration_hours: toString(activity.duration_hours),
    is_shared: toNullableBoolean(activity.is_shared),
    is_private: toNullableBoolean(activity.is_private),
    is_paid: toNullableBoolean(activity.is_paid),
    is_scheduled: toNullableBoolean(activity.is_scheduled)
  };
}

// Convert database payment schedule to application PaymentSchedule type
export function mapDbPaymentSchedule<T extends { 
  amount: string | null;
  is_paid: boolean | null;
}>(dbPaymentSchedule: T): Omit<T, 'amount' | 'is_paid'> & {
  amount: number | null;
  is_paid: boolean;
} {
  return {
    ...dbPaymentSchedule,
    amount: toNumber(dbPaymentSchedule.amount),
    is_paid: toBoolean(dbPaymentSchedule.is_paid)
  };
}

// Convert application PaymentSchedule to database payment schedule type
export function mapToDbPaymentSchedule<T extends { 
  amount: number | null;
  is_paid: boolean;
}>(paymentSchedule: T): Omit<T, 'amount' | 'is_paid'> & {
  amount: string | null;
  is_paid: boolean | null;
} {
  return {
    ...paymentSchedule,
    amount: toString(paymentSchedule.amount),
    is_paid: toNullableBoolean(paymentSchedule.is_paid)
  };
}
