import { Period } from './classes/Period'
import { lettersTimeFilter } from '../filters/DateTimeFilters'

export interface TaskDuration {
  total: string,
  onDate: string,
}
export function getTaskDurations(periods: Period[], selectedDate: Date): TaskDuration {
  let totalMiliseconds = 0;
  let onDateMiliseconds = 0;
  periods.forEach(period => {
    totalMiliseconds += period.duration;
    if (period.isFinishedOnDate(selectedDate)) onDateMiliseconds += period.duration;
  });

  const taskDuration: TaskDuration = {
    total: `${lettersTimeFilter(totalMiliseconds)}`,
    onDate: `${lettersTimeFilter(onDateMiliseconds)}`,
  };

  return taskDuration;
}