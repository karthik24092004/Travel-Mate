/**
 * Expense Tracker Component
 * 
 * Allows users to add and track expenses with:
 * - Amount and description
 * - Who paid
 * - Category (travel / food / stay / misc)
 * - Who shares the expense
 */

import { useState } from 'react';
import { Trip, Expense, ExpenseCategory, generateId, categoryLabels } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Receipt, Plus, Trash2, IndianRupee, User, Tag } from 'lucide-react';

interface ExpenseTrackerProps {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
}

const ExpenseTracker = ({ trip, onUpdate }: ExpenseTrackerProps) => {
  // Form state
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('misc');
  const [sharedAmong, setSharedAmong] = useState<string[]>([...trip.participants]);

  // Reset form
  const resetForm = () => {
    setAmount('');
    setDescription('');
    setPaidBy('');
    setCategory('misc');
    setSharedAmong([...trip.participants]);
  };

  // Toggle participant in shared list
  const toggleSharedParticipant = (name: string) => {
    if (sharedAmong.includes(name)) {
      // Don't allow empty shared list
      if (sharedAmong.length > 1) {
        setSharedAmong(sharedAmong.filter(n => n !== name));
      }
    } else {
      setSharedAmong([...sharedAmong, name]);
    }
  };

  // Select all participants
  const selectAllParticipants = () => {
    setSharedAmong([...trip.participants]);
  };

  // Add new expense
  const addExpense = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0 || !paidBy || sharedAmong.length === 0) return;

    const expense: Expense = {
      id: generateId(),
      amount: amountNum,
      paidBy,
      category,
      description: description.trim() || `${categoryLabels[category]} expense`,
      sharedAmong: [...sharedAmong],
      date: new Date().toISOString(),
    };

    onUpdate({
      ...trip,
      expenses: [...trip.expenses, expense],
    });
    
    resetForm();
  };

  // Delete expense
  const deleteExpense = (expenseId: string) => {
    onUpdate({
      ...trip,
      expenses: trip.expenses.filter(e => e.id !== expenseId),
    });
  };

  // Get category badge style
  const getCategoryStyle = (cat: ExpenseCategory): string => {
    switch (cat) {
      case 'travel': return 'bg-sky-100 text-sky-700';
      case 'food': return 'bg-orange-100 text-orange-700';
      case 'stay': return 'bg-violet-100 text-violet-700';
      case 'misc': return 'bg-teal-100 text-teal-700';
    }
  };

  // Form validation
  const isFormValid = parseFloat(amount) > 0 && paidBy && sharedAmong.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Receipt className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Expense Tracker</h2>
          <p className="text-sm text-muted-foreground">
            Track all expenses and who paid for them
          </p>
        </div>
      </div>

      {/* Add Expense Form */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Expense
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Paid By */}
            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid By *</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {trip.participants.map(name => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={(v: ExpenseCategory) => setCategory(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">🚌 Travel</SelectItem>
                  <SelectItem value="food">🍕 Food</SelectItem>
                  <SelectItem value="stay">🏨 Stay</SelectItem>
                  <SelectItem value="misc">📦 Miscellaneous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="e.g., Train tickets to Goa"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Shared Among */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Shared Among *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAllParticipants}
                className="text-xs h-7"
              >
                Select All
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              {trip.participants.map(name => (
                <label
                  key={name}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-background cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={sharedAmong.includes(name)}
                    onCheckedChange={() => toggleSharedParticipant(name)}
                  />
                  <span className="text-sm">{name}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {sharedAmong.length === trip.participants.length
                ? 'Split equally among everyone'
                : `Split among ${sharedAmong.length} people`}
            </p>
          </div>

          <Button onClick={addExpense} disabled={!isFormValid}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </CardContent>
      </Card>

      {/* Expenses List */}
      {trip.expenses.length === 0 ? (
        <Card className="bg-muted/30 border-0">
          <CardContent className="py-8 text-center text-muted-foreground">
            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No expenses recorded yet.</p>
            <p className="text-sm">Add your first expense using the form above!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground text-sm">
              All Expenses ({trip.expenses.length})
            </h3>
            <p className="text-sm font-medium flex items-center gap-1">
              Total: <IndianRupee className="w-3 h-3" />
              {trip.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
            </p>
          </div>

          {trip.expenses.map(expense => (
            <Card key={expense.id} className="border shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryStyle(expense.category)}`}>
                        {categoryLabels[expense.category]}
                      </span>
                      <span className="text-lg font-semibold flex items-center gap-0.5">
                        <IndianRupee className="w-4 h-4" />
                        {expense.amount.toFixed(2)}
                      </span>
                    </div>

                    <p className="font-medium text-sm">{expense.description}</p>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Paid by {expense.paidBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {expense.sharedAmong.length === trip.participants.length
                          ? 'Split by all'
                          : `Split by ${expense.sharedAmong.join(', ')}`}
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteExpense(expense.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseTracker;
