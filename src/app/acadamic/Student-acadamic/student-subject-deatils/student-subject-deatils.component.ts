import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AcadamicStudentServiceService } from '../../../acadamic-service/acadamic-student-service.service';


@Component({
  selector: 'app-student-subject-deatils',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './student-subject-deatils.component.html',
  styleUrl: './student-subject-deatils.component.css', 
})
export class StudentSubjectDeatilsComponent {
 
  currentSection: string = '';
  searchQuery: string = '';
  studentNames: string[] = [];
  classId: number = 1; // Default class ID
  errorMessage: string | null = null;
 
  subject: any = null; // Holds fetched class data
  sessions: { title: string, startTime: string, endTime: string, duration: number }[] = []; // Added sessions property
 
  buttons = [
    { label: 'View Sessions', icon: '📅' },
    { label: 'Join', icon: '➕' },
    { label: 'Classmates', icon: '👥' }
  ];
 
 
  constructor(private route: ActivatedRoute,private AcadamicStudentService:AcadamicStudentServiceService) { }
 
  ngOnInit(): void {
    this.fetchClassData(2); // Example class ID
    this.getStudents();
    this.fetchSessions(); // Added sessions fetch
  }
 
  fetchClassData(classId: number): void {
    this.AcadamicStudentService.getClassById(classId).subscribe({
      next: (data) => {
        this.subject = data;
        console.log('Class data fetched:', data);
      },
      error: (error) => {
        console.error('Error fetching class data:', error);
      },
    });
  }
 
  fetchSessions(): void {
    // Sample session data; you can replace this with a real API request
    this.sessions = [
      { title: 'Math Class', startTime: '10:00 AM', endTime: '11:00 AM', duration: 60 },
      { title: 'Physics Class', startTime: '12:00 PM', endTime: '1:30 PM', duration: 90 },
      { title: 'History Class', startTime: '2:00 PM', endTime: '3:00 PM', duration: 60 },
      { title: 'Computer Science Class', startTime: '4:00 PM', endTime: '5:30 PM', duration: 90 },
    ];
  }
 
  onButtonClick(button: any): void {
    console.log(`${button.label} button clicked!`);
    if (button.label === 'Classmates') {
      this.showClassmates();
    } else if (button.label === 'View Sessions') {
      this.showSessions();
    }
  }
 
  showClassmates(): void {
    this.currentSection = 'classmates';
  }
 
  showSessions(): void {
    this.currentSection = 'sessions';
  }
 
  joinSession(sessionTitle: string): void {
    alert(`You joined the session: ${sessionTitle}`);
  }
 
  getStudents(): void {
    this.AcadamicStudentService.getStudentNamesByClass(this.classId).subscribe({
      next: (data) => {
        this.studentNames = data.map(item => item.student.studentName || 'Unnamed Student');
        this.errorMessage = null; 
        console.log(data)
      },
      error: (err) => {
        this.errorMessage = 'Failed to load student names.';
        console.error('Error fetching student names:', err);
      },
    });
  }
 
  filteredClassmates(): string[] {
    return this.searchQuery
      ? this.studentNames.filter(name =>
          name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      : this.studentNames;
  }
}

