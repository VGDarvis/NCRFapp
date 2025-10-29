import { parseISO, isAfter, isBefore, isEqual } from "date-fns";

export interface TimeSlot {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  type: "seminar" | "booth";
  location?: string;
}

export interface ScheduleConflict {
  type: "overlap" | "warning";
  items: TimeSlot[];
  message: string;
}

/**
 * Check if two time slots overlap
 */
export const timeSlotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
  const start1 = parseISO(slot1.start_time);
  const end1 = parseISO(slot1.end_time);
  const start2 = parseISO(slot2.start_time);
  const end2 = parseISO(slot2.end_time);

  // Check if one time slot starts before the other ends
  return (
    (isAfter(start1, start2) && isBefore(start1, end2)) || // slot1 starts during slot2
    (isAfter(start2, start1) && isBefore(start2, end1)) || // slot2 starts during slot1
    isEqual(start1, start2) || // same start time
    isEqual(end1, end2) // same end time
  );
};

/**
 * Detect all conflicts in a schedule
 */
export const detectScheduleConflicts = (
  timeSlots: TimeSlot[]
): ScheduleConflict[] => {
  const conflicts: ScheduleConflict[] = [];
  const checked = new Set<string>();

  for (let i = 0; i < timeSlots.length; i++) {
    for (let j = i + 1; j < timeSlots.length; j++) {
      const key = `${timeSlots[i].id}-${timeSlots[j].id}`;
      if (checked.has(key)) continue;

      if (timeSlotsOverlap(timeSlots[i], timeSlots[j])) {
        conflicts.push({
          type: "overlap",
          items: [timeSlots[i], timeSlots[j]],
          message: `"${timeSlots[i].title}" and "${timeSlots[j].title}" overlap in time`,
        });
        checked.add(key);
      }
    }
  }

  return conflicts;
};

/**
 * Group time slots by time for timeline display
 */
export const groupByTime = (timeSlots: TimeSlot[]): Map<string, TimeSlot[]> => {
  const grouped = new Map<string, TimeSlot[]>();

  timeSlots
    .sort((a, b) => parseISO(a.start_time).getTime() - parseISO(b.start_time).getTime())
    .forEach((slot) => {
      const timeKey = slot.start_time;
      const existing = grouped.get(timeKey) || [];
      grouped.set(timeKey, [...existing, slot]);
    });

  return grouped;
};

/**
 * Calculate total duration of schedule in hours
 */
export const calculateTotalDuration = (timeSlots: TimeSlot[]): number => {
  let totalMinutes = 0;

  timeSlots.forEach((slot) => {
    const start = parseISO(slot.start_time);
    const end = parseISO(slot.end_time);
    const durationMs = end.getTime() - start.getTime();
    totalMinutes += durationMs / (1000 * 60);
  });

  return Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal
};
