/**
 * TravelMate Type Definitions
 * 
 * These types define the core data structures used throughout the application.
 * All data is stored in localStorage and managed through React state.
 */

// Unique identifier type (using simple string IDs)
export type ID = string;

// Time slot options for activities
export type TimeSlot = 'morning' | 'afternoon' | 'evening';

// Expense categories
export type ExpenseCategory = 'travel' | 'food' | 'stay' | 'misc';

/**
 * Represents a single activity within a day
 */
export interface Activity {
  id: ID;
  location: string;
  description: string;  // Free text for activities
  timeSlot: TimeSlot;
  estimatedCost?: number;  // Optional estimated cost in rupees
}

/**
 * Represents a single day in the itinerary
 */
export interface Day {
  id: ID;
  dayNumber: number;  // 1, 2, 3, etc.
  activities: Activity[];
}

/**
 * Represents a single expense entry
 */
export interface Expense {
  id: ID;
  amount: number;  // Amount in rupees
  paidBy: string;  // Participant name who paid
  category: ExpenseCategory;
  description: string;
  sharedAmong: string[];  // List of participant names who share this expense
  date: string;  // ISO date string for reference
}

/**
 * Represents the main trip data structure
 */
export interface Trip {
  id: ID;
  name: string;
  participants: string[];  // List of participant names
  numberOfDays: number;
  days: Day[];
  expenses: Expense[];
  createdAt: string;  // ISO date string
}

/**
 * Balance calculation result for a participant
 * 
 * Logic explanation:
 * - totalPaid: Sum of all expenses paid by this participant
 * - totalShare: Sum of their share in all expenses they're part of
 * - netBalance: totalPaid - totalShare
 *   - Positive: This person paid more than their share (others owe them)
 *   - Negative: This person owes money to others
 */
export interface ParticipantBalance {
  name: string;
  totalPaid: number;
  totalShare: number;
  netBalance: number;  // Positive = is owed money, Negative = owes money
}

/**
 * Settlement transaction
 * Represents a single payment from one person to another
 */
export interface Settlement {
  from: string;  // Person who needs to pay
  to: string;    // Person who receives payment
  amount: number;  // Amount in rupees
}

/**
 * Budget summary for the entire trip
 */
export interface BudgetSummary {
  totalCost: number;
  participantBalances: ParticipantBalance[];
  settlements: Settlement[];
}

// Helper function to generate simple unique IDs
export const generateId = (): ID => {
  return Math.random().toString(36).substring(2, 11);
};

// Category display labels
export const categoryLabels: Record<ExpenseCategory, string> = {
  travel: 'Travel',
  food: 'Food',
  stay: 'Stay',
  misc: 'Miscellaneous',
};

// Time slot display labels
export const timeSlotLabels: Record<TimeSlot, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
};
