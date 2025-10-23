import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startDate: Date;
  endDate: Date;
  url?: string;
}

export function generateICSFile(event: CalendarEvent): string {
  const formatICSDate = (date: Date): string => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const escapeText = (text: string): string => {
    return text.replace(/[,;\\]/g, '\\$&').replace(/\n/g, '\\n');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NCRF College Expo//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@ncrf.org`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(event.startDate)}`,
    `DTEND:${formatICSDate(event.endDate)}`,
    `SUMMARY:${escapeText(event.title)}`,
    event.description ? `DESCRIPTION:${escapeText(event.description)}` : '',
    event.location ? `LOCATION:${escapeText(event.location)}` : '',
    event.url ? `URL:${event.url}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].filter(Boolean).join('\r\n');

  return icsContent;
}

export function downloadICSFile(event: CalendarEvent, filename: string = 'event.ics'): void {
  const icsContent = generateICSFile(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
