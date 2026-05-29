/**
 * Trip Setup Component
 * 
 * Handles the initial trip configuration:
 * - Trip name
 * - Number of participants and their names
 * - Trip duration (number of days)
 */

import { useState } from 'react';
import { Trip, Day, generateId } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, MapPin } from 'lucide-react';

interface TripSetupProps {
  onComplete: (trip: Trip) => void;
  existingTrip?: Trip | null;
}

const TripSetup = ({ onComplete, existingTrip }: TripSetupProps) => {
  // Initialize state from existing trip or defaults
  const [tripName, setTripName] = useState(existingTrip?.name || '');
  const [numberOfDays, setNumberOfDays] = useState(existingTrip?.numberOfDays || 3);
  const [participants, setParticipants] = useState<string[]>(
    existingTrip?.participants || ['']
  );

  // Add a new participant input field
  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  // Remove a participant by index
  const removeParticipant = (index: number) => {
    if (participants.length > 1) {
      setParticipants(participants.filter((_, i) => i !== index));
    }
  };

  // Update participant name at specific index
  const updateParticipant = (index: number, name: string) => {
    const updated = [...participants];
    updated[index] = name;
    setParticipants(updated);
  };

  // Validate form before submission
  const isValid = (): boolean => {
    if (!tripName.trim()) return false;
    if (numberOfDays < 1) return false;
    
    // Filter out empty participant names
    const validParticipants = participants.filter(p => p.trim());
    if (validParticipants.length < 2) return false;  // Need at least 2 participants
    
    // Check for duplicate names
    const uniqueNames = new Set(validParticipants.map(p => p.trim().toLowerCase()));
    if (uniqueNames.size !== validParticipants.length) return false;
    
    return true;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isValid()) return;

    // Filter and clean participant names
    const cleanedParticipants = participants
      .map(p => p.trim())
      .filter(p => p);

    // Create empty days for the itinerary
    const days: Day[] = Array.from({ length: numberOfDays }, (_, i) => ({
      id: generateId(),
      dayNumber: i + 1,
      activities: [],
    }));

    // Create the trip object
    const trip: Trip = {
      id: existingTrip?.id || generateId(),
      name: tripName.trim(),
      participants: cleanedParticipants,
      numberOfDays,
      days: existingTrip?.days || days,
      expenses: existingTrip?.expenses || [],
      createdAt: existingTrip?.createdAt || new Date().toISOString(),
    };

    onComplete(trip);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Set Up Your Trip</CardTitle>
          <CardDescription className="text-base">
            Enter the basic details to start planning your group trip
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-4">
          {/* Trip Name */}
          <div className="space-y-2">
            <Label htmlFor="tripName" className="text-sm font-medium">
              Trip Name
            </Label>
            <Input
              id="tripName"
              placeholder="e.g., Goa Adventure 2024"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="h-11"
            />
          </div>

          {/* Trip Duration */}
          <div className="space-y-2">
            <Label htmlFor="numberOfDays" className="text-sm font-medium">
              Trip Duration (Days)
            </Label>
            <Input
              id="numberOfDays"
              type="number"
              min={1}
              max={30}
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(Math.max(1, parseInt(e.target.value) || 1))}
              className="h-11 w-32"
            />
            <p className="text-sm text-muted-foreground">
              You can plan activities for each day
            </p>
          </div>

          {/* Participants */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Participants ({participants.filter(p => p.trim()).length})
            </Label>
            <p className="text-sm text-muted-foreground">
              Add at least 2 people who will be part of this trip
            </p>
            
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`Participant ${index + 1}`}
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    className="h-10"
                  />
                  {participants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeParticipant(index)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addParticipant}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Participant
            </Button>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!isValid()}
              className="w-full h-11 text-base"
            >
              {existingTrip ? 'Update Trip' : 'Create Trip'}
            </Button>
            
            {!isValid() && (
              <p className="text-sm text-muted-foreground text-center mt-2">
                Please fill in all fields and add at least 2 unique participants
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center mt-6 px-4">
        This is a planning and estimation tool only. 
        Please verify all expenses and calculations manually.
      </p>
    </div>
  );
};

export default TripSetup;
