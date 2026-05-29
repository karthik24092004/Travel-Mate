/**
 * Budget Summary Component
 * 
 * Displays the complete expense analysis:
 * - Total trip cost
 * - Category breakdown
 * - Per-person contributions and shares
 * - Clear indication of who paid extra or owes money
 * 
 * All calculations are done using simple arithmetic for easy explanation.
 */

import { Trip, categoryLabels, ExpenseCategory } from '@/types/trip';
import { generateBudgetSummary, getCategoryBreakdown } from '@/lib/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, TrendingUp, TrendingDown, IndianRupee, Users, Wallet } from 'lucide-react';

interface BudgetSummaryProps {
  trip: Trip;
}

const BudgetSummary = ({ trip }: BudgetSummaryProps) => {
  // Calculate all budget metrics
  const summary = generateBudgetSummary(trip.expenses, trip.participants);
  const categoryBreakdown = getCategoryBreakdown(trip.expenses);

  // No expenses yet
  if (trip.expenses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <PieChart className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Budget Summary</h2>
            <p className="text-sm text-muted-foreground">
              View expense breakdown and individual contributions
            </p>
          </div>
        </div>

        <Card className="bg-muted/30 border-0">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No expenses recorded yet.</p>
            <p className="text-sm">Add expenses in the Expenses tab to see the summary.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get category icon
  const getCategoryIcon = (cat: string): string => {
    switch (cat) {
      case 'travel': return '🚌';
      case 'food': return '🍕';
      case 'stay': return '🏨';
      case 'misc': return '📦';
      default: return '📦';
    }
  };

  // Get bar width as percentage
  const getBarWidth = (value: number, max: number): number => {
    if (max === 0) return 0;
    return Math.max(5, (value / max) * 100);
  };

  // Get category bar color
  const getCategoryColor = (cat: string): string => {
    switch (cat) {
      case 'travel': return 'bg-category-travel';
      case 'food': return 'bg-category-food';
      case 'stay': return 'bg-category-stay';
      case 'misc': return 'bg-category-misc';
      default: return 'bg-muted';
    }
  };

  const maxCategoryValue = Math.max(...Object.values(categoryBreakdown));
  const costPerPerson = summary.totalCost / trip.participants.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <PieChart className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Budget Summary</h2>
          <p className="text-sm text-muted-foreground">
            View expense breakdown and individual contributions
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Trip Cost</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {summary.totalCost.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Cost Per Person</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {costPerPerson.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Participants</p>
            <p className="text-2xl font-bold flex items-center gap-1">
              <Users className="w-5 h-5" />
              {trip.participants.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Expense by Category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(categoryBreakdown).map(([cat, amount]) => (
            <div key={cat} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span>{getCategoryIcon(cat)}</span>
                  <span>{categoryLabels[cat as ExpenseCategory]}</span>
                </span>
                <span className="font-medium flex items-center gap-0.5">
                  <IndianRupee className="w-3 h-3" />
                  {amount.toFixed(2)}
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full ${getCategoryColor(cat)} rounded-full transition-all duration-500`}
                  style={{ width: `${getBarWidth(amount, maxCategoryValue)}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Individual Contributions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Individual Contributions</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            How much each person paid vs their fair share
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header Row */}
            <div className="grid grid-cols-4 gap-2 text-xs text-muted-foreground font-medium pb-2 border-b">
              <div>Person</div>
              <div className="text-right">Paid</div>
              <div className="text-right">Fair Share</div>
              <div className="text-right">Balance</div>
            </div>

            {/* Participant Rows */}
            {summary.participantBalances.map(balance => (
              <div key={balance.name} className="grid grid-cols-4 gap-2 items-center text-sm">
                <div className="font-medium truncate">{balance.name}</div>
                <div className="text-right flex items-center justify-end gap-0.5">
                  <IndianRupee className="w-3 h-3" />
                  {balance.totalPaid.toFixed(2)}
                </div>
                <div className="text-right text-muted-foreground flex items-center justify-end gap-0.5">
                  <IndianRupee className="w-3 h-3" />
                  {balance.totalShare.toFixed(2)}
                </div>
                <div className={`text-right font-medium flex items-center justify-end gap-1 ${
                  balance.netBalance > 0 
                    ? 'text-success' 
                    : balance.netBalance < 0 
                      ? 'text-destructive' 
                      : ''
                }`}>
                  {balance.netBalance > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : balance.netBalance < 0 ? (
                    <TrendingDown className="w-3 h-3" />
                  ) : null}
                  <span className="flex items-center gap-0.5">
                    {balance.netBalance > 0 ? '+' : ''}
                    <IndianRupee className="w-3 h-3" />
                    {Math.abs(balance.netBalance).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Explanation */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm space-y-2">
            <p className="font-medium">How to read this:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                <span className="text-success">Positive balance</span> = They paid more than their share (others owe them)
              </li>
              <li>
                <span className="text-destructive">Negative balance</span> = They paid less than their share (they owe others)
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;
