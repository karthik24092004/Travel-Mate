/**
 * Trip Storage Utilities
 * 
 * Handles saving and loading trip data from localStorage.
 * This ensures data persists between browser sessions.
 */

import { Trip } from '@/types/trip';

const STORAGE_KEY = 'travelmate_trip';

/**
 * Save trip data to localStorage
 * Converts the trip object to JSON and stores it
 */
export const saveTrip = (trip: Trip): void => {
  try {
    const serialized = JSON.stringify(trip);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error('Failed to save trip to localStorage:', error);
  }
};

/**
 * Load trip data from localStorage
 * Returns null if no trip exists or if parsing fails
 */
export const loadTrip = (): Trip | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return null;
    return JSON.parse(serialized) as Trip;
  } catch (error) {
    console.error('Failed to load trip from localStorage:', error);
    return null;
  }
};

/**
 * Clear trip data from localStorage
 * Used when starting a new trip
 */
export const clearTrip = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear trip from localStorage:', error);
  }
};

/**
 * Check if a trip exists in localStorage
 */
export const hasSavedTrip = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) !== null;
};
