/**
 * Itinerary Planner Component
 * 
 * Allows users to plan activities for each day of the trip.
 * Features:
 * - Day-wise planning tabs
 * - Add activities with location, description, time slot, and optional cost
 * - Edit and delete activities
 */

import { useState } from 'react';
import { Trip, Day, Activity, TimeSlot, generateId, timeSlotLabels } from '@/types/trip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, Plus, Trash2, IndianRupee } from 'lucide-react';

interface ItineraryPlannerProps {
  trip: Trip;
  onUpdate: (trip: Trip) => void;
}

const ItineraryPlanner = ({ trip, onUpdate }: ItineraryPlannerProps) => {
  const [selectedDay, setSelectedDay] = useState<string>(trip.days[0]?.id || '');
  
  // Form state for new activity
  const [newActivity, setNewActivity] = useState({
    location: '',
    description: '',
    timeSlot: 'morning' as TimeSlot,
    estimatedCost: '',
  });

  // Get the currently selected day object
  const currentDay = trip.days.find(d => d.id === selectedDay);

  // Reset the activity form
  const resetForm = () => {
    setNewActivity({
      location: '',
      description: '',
      timeSlot: 'morning',
      estimatedCost: '',
    });
  };

  // Add a new activity to the current day
  const addActivity = () => {
    if (!currentDay || !newActivity.location.trim()) return;

    const activity: Activity = {
      id: generateId(),
      location: newActivity.location.trim(),
      description: newActivity.description.trim(),
      timeSlot: newActivity.timeSlot,
      estimatedCost: newActivity.estimatedCost 
        ? parseFloat(newActivity.estimatedCost) 
        : undefined,
    };

    const updatedDays = trip.days.map(day => {
      if (day.id === currentDay.id) {
        return {
          ...day,
          activities: [...day.activities, activity],
        };
      }
      return day;
    });

    onUpdate({ ...trip, days: updatedDays });
    resetForm();
  };

  // Delete an activity
  const deleteActivity = (dayId: string, activityId: string) => {
    const updatedDays = trip.days.map(day => {
      if (day.id === dayId) {
        return {
          ...day,
          activities: day.activities.filter(a => a.id !== activityId),
        };
      }
      return day;
    });

    onUpdate({ ...trip, days: updatedDays });
  };

  // Sort activities by time slot
  const sortedActivities = (activities: Activity[]) => {
    const order: Record<TimeSlot, number> = { morning: 0, afternoon: 1, evening: 2 };
    return [...activities].sort((a, b) => order[a.timeSlot] - order[b.timeSlot]);
  };

  // Get time slot badge color
  const getTimeSlotColor = (slot: TimeSlot): string => {
    switch (slot) {
      case 'morning': return 'bg-amber-100 text-amber-700';
      case 'afternoon': return 'bg-sky-100 text-sky-700';
      case 'evening': return 'bg-indigo-100 text-indigo-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Calendar className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">Itinerary Planner</h2>
          <p className="text-sm text-muted-foreground">
            Plan activities for each day of your trip
          </p>
        </div>
      </div>

      {/* Day Tabs */}
      <Tabs value={selectedDay} onValueChange={setSelectedDay}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {trip.days.map(day => (
            <TabsTrigger
              key={day.id}
              value={day.id}
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
            >
              Day {day.dayNumber}
              {day.activities.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {day.activities.length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {trip.days.map(day => (
          <TabsContent key={day.id} value={day.id} className="mt-4 space-y-4">
            {/* Add Activity Form */}
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Add Activity for Day {day.dayNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Baga Beach"
                      value={newActivity.location}
                      onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeSlot">Time Slot</Label>
                    <Select
                      value={newActivity.timeSlot}
                      onValueChange={(value: TimeSlot) => setNewActivity({ ...newActivity, timeSlot: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="afternoon">Afternoon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Activities (optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Swimming, beach volleyball, sunset viewing..."
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="flex flex-wrap gap-4 items-end">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost (optional)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="estimatedCost"
                        type="number"
                        min={0}
                        placeholder="0"
                        value={newActivity.estimatedCost}
                        onChange={(e) => setNewActivity({ ...newActivity, estimatedCost: e.target.value })}
                        className="pl-9 w-32"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={addActivity}
                    disabled={!newActivity.location.trim()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Activities List */}
            {day.activities.length === 0 ? (
              <Card className="bg-muted/30 border-0">
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No activities planned for this day yet.</p>
                  <p className="text-sm">Use the form above to add your first activity!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {sortedActivities(day.activities).map(activity => (
                  <Card key={activity.id} className="border shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTimeSlotColor(activity.timeSlot)}`}>
                              {timeSlotLabels[activity.timeSlot]}
                            </span>
                            {activity.estimatedCost !== undefined && (
                              <span className="text-xs bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                                <IndianRupee className="w-3 h-3" />
                                {activity.estimatedCost}
                              </span>
                            )}
                          </div>
                          
                          <h4 className="font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            {activity.location}
                          </h4>
                          
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-1 ml-6">
                              {activity.description}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteActivity(day.id, activity.id)}
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
          </TabsContent>
        ))}
      </Tabs>

      {/* Summary */}
      {trip.days.some(d => d.activities.length > 0) && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Activities: </span>
                <span className="font-medium">
                  {trip.days.reduce((sum, d) => sum + d.activities.length, 0)}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Estimated Total: </span>
                <span className="font-medium flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" />
                  {trip.days.reduce((sum, d) => 
                    sum + d.activities.reduce((daySum, a) => 
                      daySum + (a.estimatedCost || 0), 0
                    ), 0
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ItineraryPlanner;
