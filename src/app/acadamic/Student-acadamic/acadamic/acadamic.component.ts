import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineWithDatesComponent } from '../calender/calender.component';
import { FormsModule } from '@angular/forms';
import { ExamsPageComponent } from '../exams-page/exams-page.component';
import { ResultsPageComponent } from '../results-page/results-page.component';
import { CertificatesPageComponent } from "../certificates-page/certificates-page.component";
import { StudentHomeComponent } from "../student-home/student-home.component";
import { AcadamicStudentServiceService } from '../../../acadamic-service/acadamic-student-service.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-acadamic',
  standalone: true,
  imports: [CommonModule, TimelineWithDatesComponent, FormsModule, ExamsPageComponent, ResultsPageComponent, CertificatesPageComponent, StudentHomeComponent],
  templateUrl: './acadamic.component.html',
  styleUrls: ['./acadamic.component.css'] // Corrected this line
})

export class AcadamicComponent {
  constructor(private service:AcadamicStudentServiceService, private router:Router ){}
  teacherId!:number;
  Subjects!:any;

  ngOnInit(): void {
    this.teacherId = 1
    this.getSubjectsdata(this.teacherId);
  }

  GotoClassroom(subjectId:number){
    this.router.navigate(['/subjectDetails', subjectId]);
  }

  getSubjectsdata(teacherid:number){
    this.service.getSubject(teacherid).subscribe(
      {next:(response)=>{
        console.log(response);
        this.Subjects = response;
      },
      error:(error)=>{
        console.log(error);
      }}
    )
  }

  
  isFolded = signal(false);

  tab:string="Home";

  // Menu items with icons
  menuItems = [
    { label: 'Home', icon: 'fas fa-home'},
    { label: 'Subjects', icon: 'fas fa-book'},
    { label: 'Routine', icon: 'fas fa-calendar-alt'},
    { label: 'LiveClass', icon: 'fas fa-video' },
    { label: 'Assignments', icon: 'fas fa-tasks'},
    { label: 'Classmates', icon: 'fas fa-users' },
    // { label: 'Mentors', icon: 'fas fa-chalkboard-teacher'},

    { label: 'Exam', icon: 'fas fa-graduation-cap'},
    { label: 'Result', icon: 'fas fa-poll'},
    { label: 'Certificates', icon: 'fas fa-certificate'}
  ];

  classmates: any[] = [
    { "name": "John Doe", "age": 20, "subject": "Mathematics" },
    { "name": "Jane Smith", "age": 21, "subject": "Physics" },
    { "name": "Sam Wilson", "age": 19, "subject": "Computer Science" },
    { "name": "Emily Davis", "age": 22, "subject": "History" }
  ];  



  // Toggle fold/unfold of sidebar
  toggleFold() {
    this.isFolded.update(folded => !folded);
  }

  // Navigation method
  navigateTo(route: string) {
    this.tab= route;
    if(route=='Mentors'){
      this.isFolded.update(folded => true);
    }
  }

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
}
