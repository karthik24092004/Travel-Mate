/**
 * TravelMate - Index Page
 * 
 * Main application page with tabbed navigation between:
 * 1. Trip Setup - Configure trip details and participants
 * 2. Itinerary - Plan day-wise activities
 * 3. Expenses - Track and record expenses
 * 4. Summary - View budget breakdown
 * 5. Settle - Calculate and view settlements
 * 
 * Data is persisted in localStorage for session continuity.
 */

import { useState, useEffect } from 'react';
import { Trip } from '@/types/trip';
import { saveTrip, loadTrip, clearTrip } from '@/lib/tripStorage';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import TripSetup from '@/components/TripSetup';
import ItineraryPlanner from '@/components/ItineraryPlanner';
import ExpenseTracker from '@/components/ExpenseTracker';
import BudgetSummary from '@/components/BudgetSummary';
import SettlementOutput from '@/components/SettlementOutput';
import { 
  MapPin, 
  Calendar, 
  Receipt, 
  PieChart, 
  Handshake, 
  Trash2,
  Plane
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Index = () => {
  // Load trip from localStorage on mount
  const [trip, setTrip] = useState<Trip | null>(() => loadTrip());
  const [activeTab, setActiveTab] = useState('setup');

  // Save trip to localStorage whenever it changes
  useEffect(() => {
    if (trip) {
      saveTrip(trip);
    }
  }, [trip]);

  // Handle trip creation/update
  const handleTripUpdate = (updatedTrip: Trip) => {
    setTrip(updatedTrip);
    // Move to itinerary after setup
    if (activeTab === 'setup') {
      setActiveTab('itinerary');
    }
  };

  // Reset everything and start fresh
  const handleReset = () => {
    clearTrip();
    setTrip(null);
    setActiveTab('setup');
  };

  // If no trip exists, show only setup
  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card">
          <div className="container py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">TravelMate</h1>
                <p className="text-sm text-muted-foreground">Plan trips. Track expenses. Split fairly.</p>
              </div>
            </div>
          </div>
        </header>

        <main className="container py-8">
          <TripSetup onComplete={handleTripUpdate} />
        </main>
      </div>
    );
  }

  // Main app with tabs
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{trip.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {trip.participants.length} travelers • {trip.numberOfDays} days
                </p>
              </div>
            </div>

            {/* Reset Button */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Trash2 className="w-4 h-4 mr-2" />
                  New Trip
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start a New Trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all current trip data including itinerary and expenses. 
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete & Start New
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main Content with Tabs */}
      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger 
              value="setup" 
              className="flex flex-col sm:flex-row items-center gap-1 py-2 data-[state=active]:bg-background"
            >
              <MapPin className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Setup</span>
            </TabsTrigger>
            <TabsTrigger 
              value="itinerary"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 data-[state=active]:bg-background"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Itinerary</span>
            </TabsTrigger>
            <TabsTrigger 
              value="expenses"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 data-[state=active]:bg-background relative"
            >
              <Receipt className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Expenses</span>
              {trip.expenses.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {trip.expenses.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="summary"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 data-[state=active]:bg-background"
            >
              <PieChart className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Summary</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settle"
              className="flex flex-col sm:flex-row items-center gap-1 py-2 data-[state=active]:bg-background"
            >
              <Handshake className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Settle</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="setup">
            <TripSetup existingTrip={trip} onComplete={handleTripUpdate} />
          </TabsContent>

          <TabsContent value="itinerary">
            <ItineraryPlanner trip={trip} onUpdate={handleTripUpdate} />
          </TabsContent>

          <TabsContent value="expenses">
            <ExpenseTracker trip={trip} onUpdate={handleTripUpdate} />
          </TabsContent>

          <TabsContent value="summary">
            <BudgetSummary trip={trip} />
          </TabsContent>

          <TabsContent value="settle">
            <SettlementOutput trip={trip} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container py-4">
          <p className="text-xs text-muted-foreground text-center">
            TravelMate is a planning and estimation tool only. 
            Please verify all expenses and settlements manually.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
