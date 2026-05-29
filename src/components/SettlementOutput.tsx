/**
 * Settlement Output Component
 * 
 * Generates and displays minimal settlements to balance all debts.
 * 
 * ALGORITHM EXPLANATION (for viva):
 * 
 * 1. Calculate each person's net balance (paid - share)
 * 2. Separate into creditors (positive balance) and debtors (negative balance)
 * 3. Match debtors with creditors using a simple greedy approach:
 *    - Debtor pays creditor the minimum of (debt, credit)
 *    - Update balances and repeat
 * 
 * This creates minimal readable settlements like:
 * A → pays → B → ₹500
 * C → pays → A → ₹300
 */

import { Trip } from '@/types/trip';
import { generateBudgetSummary } from '@/lib/calculations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle2, IndianRupee, AlertCircle, Handshake } from 'lucide-react';

interface SettlementOutputProps {
  trip: Trip;
}

const SettlementOutput = ({ trip }: SettlementOutputProps) => {
  const summary = generateBudgetSummary(trip.expenses, trip.participants);

  // No expenses yet
  if (trip.expenses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Handshake className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Settlements</h2>
            <p className="text-sm text-muted-foreground">
              See who needs to pay whom
            </p>
          </div>
        </div>

        <Card className="bg-muted/30 border-0">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Handshake className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No expenses recorded yet.</p>
            <p className="text-sm">Add expenses to calculate settlements.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All settled (no settlements needed)
  if (summary.settlements.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Handshake className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Settlements</h2>
            <p className="text-sm text-muted-foreground">
              See who needs to pay whom
            </p>
          </div>
        </div>

        <Card className="bg-success/10 border-success/20">
          <CardContent className="py-8 text-center">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-success" />
            <p className="text-lg font-medium">All Settled!</p>
            <p className="text-sm text-muted-foreground">
              Everyone has paid their fair share. No settlements needed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Handshake className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Settlements</h2>
          <p className="text-sm text-muted-foreground">
            Minimum transactions needed to settle all debts
          </p>
        </div>
      </div>

      {/* Settlement Cards */}
      <div className="space-y-3">
        {summary.settlements.map((settlement, index) => (
          <Card key={index} className="border-l-4 border-l-primary">
            <CardContent className="py-4">
              <div className="flex items-center gap-3 flex-wrap">
                {/* From Person */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center text-sm font-medium text-destructive">
                    {settlement.from.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{settlement.from}</span>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ArrowRight className="w-4 h-4" />
                  <span className="text-sm">pays</span>
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* To Person */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center text-sm font-medium text-success">
                    {settlement.to.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium">{settlement.to}</span>
                </div>

                {/* Amount */}
                <div className="ml-auto">
                  <span className="text-lg font-bold flex items-center gap-0.5 text-primary">
                    <IndianRupee className="w-4 h-4" />
                    {settlement.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-muted/50 border-0">
        <CardContent className="py-4">
          <p className="text-sm text-center text-muted-foreground">
            <span className="font-medium">{summary.settlements.length}</span> transaction{summary.settlements.length !== 1 ? 's' : ''} needed to settle all debts
          </p>
        </CardContent>
      </Card>

      {/* Algorithm Explanation (for viva) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-muted-foreground" />
            How This Works (for explanation)
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-4">
          <div>
            <p className="font-medium text-foreground mb-2">Step-by-Step Calculation:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                <strong>Calculate Net Balance:</strong> For each person, subtract their fair share 
                from what they actually paid.
              </li>
              <li>
                <strong>Identify Creditors & Debtors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Positive balance = Creditor (is owed money)</li>
                  <li>Negative balance = Debtor (owes money)</li>
                </ul>
              </li>
              <li>
                <strong>Match & Settle:</strong> Pair each debtor with a creditor. Transfer the 
                minimum of their amounts. Repeat until all are settled.
              </li>
            </ol>
          </div>

          <div className="p-3 bg-background rounded border">
            <p className="font-medium text-foreground mb-2">Current Balances:</p>
            <div className="space-y-1">
              {summary.participantBalances.map(b => (
                <p key={b.name}>
                  {b.name}: {b.netBalance >= 0 ? '+' : ''}₹{b.netBalance.toFixed(2)}
                  {b.netBalance > 0 && ' (to receive)'}
                  {b.netBalance < 0 && ' (to pay)'}
                  {b.netBalance === 0 && ' (settled)'}
                </p>
              ))}
            </div>
          </div>

          <p className="text-xs">
            This greedy algorithm minimizes the number of transactions while ensuring 
            everyone ends up with a zero balance. It's simple to understand and verify.
          </p>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center px-4">
        This is a planning and estimation tool only. 
        Please verify all calculations and settlements manually before making actual payments.
      </p>
    </div>
  );
};

export default SettlementOutput;
