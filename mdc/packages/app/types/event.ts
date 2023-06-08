import { Appointment, Practice, PRACTICE_TYPE } from '@ankora/models';

export interface CalendarEvent {
  start: Date;
  end: Date;
  id: string;
  practiceType: PRACTICE_TYPE;
  title: string;
  playerNames?: string[];
  coachNames?: string[];
  teamName?: string;
  appointment?: Appointment;
  practice?: Practice;
  allDay?: boolean;
}
