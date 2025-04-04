import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

export interface Course {
  id: number;
  createdAt: string;
  coursePlanName: string;
  learningGoal: string;
  courseStartingPoint: string;
  preferences: string;
  weekDuration: number;
  hoursPerWeek: number;
  backgroundImage?: string;
  user: any;
}

@Component({
  selector: 'app-ai-course',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './ai-course.component.html',
  styleUrl: './ai-course.component.css',
})
export class AICourseComponent implements OnInit {
  courses: Course[] = [];
  isFormVisible = false;
  currentStep = 1;
  userId:any;
  private apiBaseUrlAI = environment.apiBaseUrlAI;


  form = {
    learningGoal: '',
    startingPoint: '',
    resources: '',
    deadline: '',
    weeklyHours: 0,
    Title: '',
  };

  steps: string[] = [
    'What is Your Learning Goal?',
    'Where Are You Starting From?',
    'Select Your Preferred Types of Learning Resources',
    'Add Time to Your Plan',
    'Name Your Learning Plan'
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.userId = localStorage.getItem('id');
    this.loadCourses();
  }

  loadCourses() {
    this.http.get<Course[]>(`http://localhost:8080/aiCoursePlans/user/${this.userId}`).subscribe({
      next: (data) => {
        const coursereverse =  data.reverse();
        this.courses = coursereverse
        this.courses.forEach((course) => {
          course.backgroundImage = this.getRandomGradient();
        });
        console.log(data)
      },
      error: (error) => {
        console.error('Error fetching courses:', error);
      },
    });
  }

  getRandomGradient(): string {
    const colors =[
      '#fef6e4', '#e8f5e9', '#e3f2fd', '#f3e5f5', '#fff3e0', // Light pastel colors
      '#fce4ec', '#e1bee7', '#c5cae9', '#b2dfdb', '#c8e6c9', // More light shades
      '#dcedc8', '#f1f8e9', '#f3f4f6', '#ffecb3', '#fbe9e7'  // Light neutral and warm shades
    ];
    const color1 = colors[Math.floor(Math.random() * colors.length)];
    const color2 = colors[Math.floor(Math.random() * colors.length)];
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  }

  data !: Course;

  generateCoursePlan() {

    const body = {
      "course_plan_name": this.form.Title,
      "learning_goal": this.form.learningGoal,
      "course_starting_point": this.form.startingPoint,
      "preferences": this.form.resources,
      "deadline": this.form.deadline,
      "hours_per_week": this.form.weeklyHours,
      "user_id": this.userId
    }

    console.log(body)

    this.http.post<Course>(`${this.apiBaseUrlAI}/generate-course-plan`, body).subscribe();
    const newCourse: Course = {
      id: 0, // Assuming a placeholder for ID; update this if needed.
      createdAt: new Date().toISOString(), // Placeholder for created date.
      coursePlanName: body.course_plan_name,
      learningGoal: body.learning_goal,
      courseStartingPoint: body.course_starting_point,
      preferences: body.preferences,
      weekDuration: this.getNumberOfWeeks(body.deadline), // Calculate week duration.
      hoursPerWeek: body.hours_per_week,
      user: { id: body.user_id }, // Assuming a user object structure.
    };
        newCourse.backgroundImage = this.getRandomGradient();
        this.courses.unshift(newCourse);
        this.isFormVisible = false;
        this.resetForm();

  }

  submitForm() {
    console.log('Form submitted:', this.form);
    this.generateCoursePlan();
  }

  resetForm() {
    this.form = {
      learningGoal: '',
      startingPoint: '',
      resources: '',
      deadline: '',
      weeklyHours: 0,
      Title: '',
    };
    this.currentStep = 1;
  }

  showForm() {
    this.isFormVisible = true;
  }

  hideForm() {
    this.isFormVisible = false;
    this.resetForm();
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  calculateMaxDate() {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);
    return maxDate.toISOString().split('T')[0];
  }

  mindate = new Date().toISOString().split('T')[0];
  maxDate = this.calculateMaxDate();


  getNumberOfWeeks(givenDate: string): number {
    const currentDate = new Date();
    const targetDate = new Date(givenDate);
  
    // Calculate the difference in milliseconds
    const differenceInMs = Math.abs(targetDate.getTime() - currentDate.getTime());
  
    // Convert milliseconds to weeks (1 week = 7 days * 24 hours * 60 minutes * 60 seconds * 1000 ms)
    const weeks = Math.ceil(differenceInMs / (7 * 24 * 60 * 60 * 1000));
  
    return weeks;
  }
  
}
