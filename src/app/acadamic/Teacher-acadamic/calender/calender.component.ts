import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-timeline-with-dates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calender.component.html',
  styleUrls: ['./calender.component.css'],
})
export class TimelineWithDatesComponent {
  dates: string[] = Array.from({ length: 15 }, (_, i) =>
    new Date(new Date().setDate(new Date().getDate() + i)).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    })
  );

  timeSlots: string[] = [
    '05:00 AM',
    '06:00 AM',
    '07:00 AM',
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
    '06:00 PM',
    '07:00 PM',
    '08:00 PM',
  ];

  events = [
    {
      title: 'Biology Part 1',
      date: this.dates[1],
      startTime: '06:00',
      endTime: '10:00',
      professor: 'Prof. Thomas Nikola',
      totalClasses: 65,
      remainingClasses: 45,
      color: '#5CB3FF',
    },
    {
      title: 'Biology Part 2',
      date: this.dates[1],
      startTime: '09:00',
      endTime: '12:00',
      professor: 'Prof. Thomas Nikola',
      totalClasses: 65,
      remainingClasses: 45,
      color: '#5CB3FF',
    },
    {
      title: 'Math Part 1',
      date: this.dates[3],
      startTime: '10:00',
      endTime: '11:00',
      professor: 'Prof. Sarah Lee',
      totalClasses: 40,
      remainingClasses: 20,
      color: '#A4E56A',
    },
    {
      title: 'Physics Part 1',
      date: this.dates[5],
      startTime: '14:00',
      endTime: '15:30',
      professor: 'Prof. Alan Smith',
      totalClasses: 50,
      remainingClasses: 30,
      color: '#FF9F43',
    },
    {
      title: 'Chemistry Part 2',
      date: this.dates[7],
      startTime: '16:00',
      endTime: '17:00',
      professor: 'Prof. John Adams',
      totalClasses: 70,
      remainingClasses: 50,
      color: '#F76C6C',
    },
  ];

  hoveredEvent: any = null;

  showDetails(event: any) {
    this.hoveredEvent = event;
  }

  hideDetails() {
    this.hoveredEvent = null;
  }

  calculateTop(date: string): string {
    const index = this.dates.indexOf(date);
    return index !== -1 ? `${index * 100}px` : '0px';
  }

  calculateLeft(startTime: string): string {
    const [hour, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + minutes;
    const startOfDayMinutes = 5 * 60; // Start of timeline (5:00 AM)
    const slotWidth = 100; // Each hour is 100px wide
    const offsetMinutes = totalMinutes - startOfDayMinutes;
    return offsetMinutes >= 0 ? `${(offsetMinutes / 60) * slotWidth}px` : '0px';
  }

  calculateWidth(startTime: string, endTime: string): string {
    const [startHour, startMinutes] = startTime.split(':').map(Number);
    const [endHour, endMinutes] = endTime.split(':').map(Number);
    const startTotalMinutes = startHour * 60 + startMinutes;
    const endTotalMinutes = endHour * 60 + endMinutes;
    const durationMinutes = endTotalMinutes - startTotalMinutes;
    const slotWidth = 100; // Each hour is 100px wide
    return `${(durationMinutes / 60) * slotWidth}px`;
  }

  hasEvent(date: string, time: string): boolean {
    return this.events.some(event => event.date === date && event.startTime === time);
  }
  
  getEvent(date: string, time: string): any {
    return this.events.find(event => event.date === date && event.startTime === time);
  }
  
}
