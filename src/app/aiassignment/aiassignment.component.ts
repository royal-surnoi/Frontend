import { Component,OnInit } from '@angular/core';
import { CourseService } from '../course.service';
import { AuthService } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule,Router,ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
 
@Component({
  selector: 'app-aiassignment',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './aiassignment.component.html',
  styleUrl: './aiassignment.component.css'
})
export class AiassignmentComponent implements OnInit {
  assignment: any;
  question: string = '';
  userAnswer: string = '';
  description: string = '';
  assignmentId: number | null = null;
grade: any;
feedback: any;
 
 
  constructor(private courseService: CourseService, private authService:AuthService,private route:ActivatedRoute,private router:Router,private http: HttpClient) {
   
  }
 
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.assignmentId = params['assignmentId'] ? +params['assignmentId'] : null;
      this.question = params['question'] || '';
     
      if (this.assignmentId) {
        console.log('Assignment ID:', this.assignmentId);
        console.log('Question:', this.question);
      } else {
        console.error('No assignment ID provided in route parameters');
      }
    });
 
    this.courseService.assignment$.subscribe(
      data => {
        if (data) {
          this.assignment = data.assignment;
          if (!this.question) {
            this.question = data.question;
          }
          if (!this.assignmentId && data.assignment && data.assignment.id) {
            this.assignmentId = data.assignment.id;
          }
          console.log('Assignment:', this.assignment);
          console.log('Question:', this.question);
        } else {
          console.warn('No assignment data available');
        }
      }
    );
 
  }
 
  startAssignment(userId:number, courseId: number, lessonId: number): void { 
    // Generate the assignment and navigate to AI Assignment component
    this.courseService.generateAssignment(userId, courseId, lessonId).subscribe(
      {next:response => {
        console.log('Assignment generated:', response);
        // Navigate to AI Assignment component with the generated assignment details
        this.router.navigate(['/aiassignment'], {
          queryParams: {
            assignmentId: response.assignment.id,
            question: response.question
          }
        });
      },
      error:error => {
        console.error('Error generating assignment:', error);
      }}
    );
  }
 
 
  saveAssignment(): void {
    console.log('Save button clicked');
    console.log('Current assignmentId:', this.assignmentId);
   
    if (!this.assignmentId) {
      console.error('No assignment ID available');
      return;
    }
 
    this.courseService.saveAssignment(this.assignmentId, this.userAnswer).subscribe(
      {next:response => {
        console.log('Assignment saved successfully:', response);
        alert("Assignment saved successfully")
        // Handle success (e.g., show a success message)
      },
      error:error => {
        console.error('Error saving assignment:', error);
        // Handle error (e.g., show an error message)
      }}
    );
  }
 
  submitAssignment(): void {
    if (!this.assignmentId) {
      console.error('No assignment ID available');
      return;
    }
 
    this.courseService.evaluateAssignment(this.assignmentId).subscribe(
      {next:response => {
        console.log('Assignment evaluated successfully:', response);
        this.grade = response.grade;
        this.feedback = response.feedback;
        // You might want to disable further submissions or navigate to a results page
      },
      error:error => {
        console.error('Error evaluating assignment:', error);
        // Handle error (e.g., show an error message)
      }}
    );
  }
 
 
 
  }
 
 
 
 
 
 