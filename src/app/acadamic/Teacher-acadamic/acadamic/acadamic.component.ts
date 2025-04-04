
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineWithDatesComponent } from '../calender/calender.component';
import { FormsModule } from '@angular/forms';
import { StudentHomeComponent } from "../student-home/student-home.component";
import { Router } from '@angular/router';
import { ClassesComponent } from '../classes/classes.component';

@Component({
  selector: 'app-acadamic',
  standalone: true,
  imports: [CommonModule, TimelineWithDatesComponent, FormsModule, StudentHomeComponent, ClassesComponent],
  templateUrl: './acadamic.component.html',
  styleUrls: ['./acadamic.component.css'] // Corrected this line
})

export class AcadamicComponentTeacher {

  searchQuery: string = ''; // Added for search functionality

  constructor(private router: Router) { }

  isFolded = signal(false);
  tab: string = "Home";
  menuItems = [
    { label: 'Home', icon: 'fas fa-home' },
    { label: 'Subjects', icon: 'fas fa-book' },
    { label: 'Routine', icon: 'fas fa-calendar-alt' },
    { label: 'LiveClass', icon: 'fas fa-video' },
    { label: 'Assignments', icon: 'fas fa-tasks' },
    { label: 'Classmates', icon: 'fas fa-users' },
    { label: 'Exam', icon: 'fas fa-graduation-cap' },
  ];

  get filteredClassmates() {
    if (!this.searchQuery.trim()) {
      return this.classmates;
    }
    return this.classmates.filter(classmate =>
      classmate.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleFold() {
    this.isFolded.update(folded => !folded);
  }

  navigateTo(route: string) {
    this.tab = route;
    if (route == 'Mentors') {
      this.isFolded.update(folded => true);
    }
  }

  classmates: any[] = [
    { "name": "John Doe", "age": 20, "subject": "Mathematics" },
    { "name": "Jane Smith", "age": 21, "subject": "Physics" },
    { "name": "Sam Wilson", "age": 19, "subject": "Computer Science" },
    { "name": "Emily Davis", "age": 22, "subject": "History" }
  ];

  subjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Chemistry' },
    { id: 4, name: 'Biology' },
    { id: 5, name: 'History' },
    { id: 6, name: 'Geography' },
    { id: 7, name: 'Computer Science' },
  ];


  liveClass = { title: 'Live Class - User Persona' };

  upcomingClasses = [
    { title: 'Biology Part 1', time: '10:00 AM', date: '2024-11-22' },
    { title: 'Biology Part 2', time: '11:00 AM', date: '2024-11-22' },
    { title: 'Math Part 1', time: '1:00 PM', date: '2024-11-22' },
    { title: 'Physics Part 1', time: '2:00 PM', date: '2024-11-22' },
  ];

  previousClasses = [
    { title: 'Higher Math', date: '2024-06-07' },
    { title: 'Quantum Physics', date: '2024-06-07' },
    { title: 'Polymer Science', date: '2024-06-07' },
  ];

  chatMessages = [
    { user: 'Taylor Swift', message: 'Hey! Did you understand?' },
    { user: 'You', message: 'Yes, I got it! 😊' },
  ];

  newMessage = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatMessages.push({ user: 'You', message: this.newMessage });
      this.newMessage = '';
    }
  }

  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectSubject(subject: string) {
    console.log(`Selected subject: ${subject}`);
    this.isDropdownOpen = false;
  }

  
}
