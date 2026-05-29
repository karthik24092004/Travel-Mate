/**
 * Budget Calculation Logic
 * 
 * This file contains all the expense splitting and settlement calculations.
 * The logic is designed to be simple and explainable for academic presentations.
 */

import { Expense, ParticipantBalance, Settlement, BudgetSummary } from '@/types/trip';

/**
 * Calculate the balance for each participant
 * 
 * LOGIC EXPLANATION:
 * 
 * Step 1: For each expense, calculate each participant's share
 *         Share = Total Amount / Number of people sharing
 * 
 * Step 2: Track two things per participant:
 *         - totalPaid: How much they actually paid
 *         - totalShare: How much they should have paid (their fair share)
 * 
 * Step 3: Calculate net balance
 *         netBalance = totalPaid - totalShare
 *         - If positive: They paid MORE than their share (others owe them)
 *         - If negative: They paid LESS than their share (they owe others)
 * 
 * @param expenses - Array of all expenses
 * @param participants - Array of all participant names
 * @returns Array of balance information per participant
 */
export const calculateBalances = (
  expenses: Expense[],
  participants: string[]
): ParticipantBalance[] => {
  // Initialize balance tracking for each participant
  const balanceMap = new Map<string, { paid: number; share: number }>();
  
  participants.forEach(name => {
    balanceMap.set(name, { paid: 0, share: 0 });
  });

  // Process each expense
  expenses.forEach(expense => {
    // Add the paid amount to the payer
    const payerBalance = balanceMap.get(expense.paidBy);
    if (payerBalance) {
      payerBalance.paid += expense.amount;
    }

    // Calculate per-person share for this expense
    // Simple division: total / number of people sharing
    const sharePerPerson = expense.amount / expense.sharedAmong.length;

    // Add the share to each person who shares this expense
    expense.sharedAmong.forEach(name => {
      const balance = balanceMap.get(name);
      if (balance) {
        balance.share += sharePerPerson;
      }
    });
  });

  // Convert map to array of ParticipantBalance objects
  return participants.map(name => {
    const balance = balanceMap.get(name)!;
    return {
      name,
      totalPaid: Math.round(balance.paid * 100) / 100,  // Round to 2 decimals
      totalShare: Math.round(balance.share * 100) / 100,
      netBalance: Math.round((balance.paid - balance.share) * 100) / 100,
    };
  });
};

/**
 * Calculate settlements (who pays whom)
 * 
 * ALGORITHM EXPLANATION (Simple Greedy Approach):
 * 
 * This algorithm finds minimal number of transactions to settle all debts.
 * 
 * Step 1: Separate participants into:
 *         - Creditors (positive balance - they are owed money)
 *         - Debtors (negative balance - they owe money)
 * 
 * Step 2: Match debtors with creditors:
 *         - Take the first debtor and first creditor
 *         - Transfer the minimum of (debt, credit)
 *         - Update balances
 *         - Remove anyone with zero balance
 *         - Repeat until all settled
 * 
 * This approach is NOT mathematically optimal for minimum transactions,
 * but it's simple to understand and explain in a viva.
 * 
 * @param balances - Array of participant balances
 * @returns Array of settlement transactions
 */
export const calculateSettlements = (
  balances: ParticipantBalance[]
): Settlement[] => {
  const settlements: Settlement[] = [];
  
  // Create working copies with only those who have non-zero balance
  // Creditors: those who paid more (positive balance)
  // Debtors: those who paid less (negative balance)
  const creditors = balances
    .filter(b => b.netBalance > 0.01)  // Small threshold to avoid floating point issues
    .map(b => ({ name: b.name, amount: b.netBalance }));
  
  const debtors = balances
    .filter(b => b.netBalance < -0.01)
    .map(b => ({ name: b.name, amount: Math.abs(b.netBalance) }));

  // Greedy settlement: match debtors with creditors
  let creditorIndex = 0;
  let debtorIndex = 0;

  while (creditorIndex < creditors.length && debtorIndex < debtors.length) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    // Settlement amount is the minimum of what's owed and what's due
    const amount = Math.min(creditor.amount, debtor.amount);

    if (amount > 0.01) {  // Only create settlement if amount is meaningful
      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(amount * 100) / 100,  // Round to 2 decimals
      });
    }

    // Update remaining amounts
    creditor.amount -= amount;
    debtor.amount -= amount;

    // Move to next person if current one is settled
    if (creditor.amount < 0.01) {
      creditorIndex++;
    }
    if (debtor.amount < 0.01) {
      debtorIndex++;
    }
  }

  return settlements;
};

/**
 * Generate complete budget summary
 * 
 * Combines all calculations into a single summary object.
 * 
 * @param expenses - All trip expenses
 * @param participants - All participant names
 * @returns Complete budget summary with totals, balances, and settlements
 */
export const generateBudgetSummary = (
  expenses: Expense[],
  participants: string[]
): BudgetSummary => {
  // Calculate total cost (sum of all expenses)
  const totalCost = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate individual balances
  const participantBalances = calculateBalances(expenses, participants);

  // Calculate settlements
  const settlements = calculateSettlements(participantBalances);

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    participantBalances,
    settlements,
  };
};

/**
 * Get expense breakdown by category
 * 
 * @param expenses - All trip expenses
 * @returns Object with total per category
 */
export const getCategoryBreakdown = (
  expenses: Expense[]
): Record<string, number> => {
  const breakdown: Record<string, number> = {
    travel: 0,
    food: 0,
    stay: 0,
    misc: 0,
  };

  expenses.forEach(expense => {
    breakdown[expense.category] += expense.amount;
  });

  // Round all values
  Object.keys(breakdown).forEach(key => {
    breakdown[key] = Math.round(breakdown[key] * 100) / 100;
  });

  return breakdown;
};
