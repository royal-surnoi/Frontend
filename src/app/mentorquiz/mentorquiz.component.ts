import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FusionService} from '../fusion.service';
import { ActivatedRoute, Router } from '@angular/router';
 
interface Question {
  text: string;
  type: string;
  options: Option[];
  correctAnswer: string;
}
 
interface Option {
  label: string;
  text: string;
}
 
@Component({
  selector: 'app-mentorquiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mentorquiz.component.html',
  styleUrls: ['./mentorquiz.component.css']
})
export class MentorquizComponent {
  startDate: string = '';
  endDate: string = '';
  quizName: string = '';
  courseId: any;
  isDarkMode = false;
  showQuiz = false;
  score = 0;
  questionCount = 0;
  questions: any[] = [];
  isQuizCreated: boolean = false;
  // courseId: number;
  teacherId: any;
  minDateTime: string = '';  
  minEndDate: string = '';
  constructor(
    private fusionService: FusionService,
    private router: Router,
    private route: ActivatedRoute) {}
    navigateToDashboard() {
      this.router.navigate(['/mentorperspective']);
    }
 
  ngOnInit() {
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
    this.teacherId = +localStorage.getItem('id')!;
    this.setMinDateTime();
  }
  addMCQ() {
    this.questions.push({
      text: '',
      type: 'mcq',
      options: [
        { label: 'A', text: '' },
        { label: 'B', text: '' },
        { label: 'C', text: '' },
        { label: 'D', text: '' }
      ],
      correctAnswer: ''
    });
  }
 
  addTrueFalse() {
    this.questions.push({
      text: '',
      type: 'truefalse',
      correctAnswer: ''
    });
  }
 
  createQuiz() {
    this.showQuiz = true;
  }
 
  resetQuestions() {
    this.questions = [];
    this.questionCount = 0;
  }
 
  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
    this.questionCount--;
  }
 
  quizId: any;
 
  onSaveQuiz(): void {
    // Validate input fields
    if (!this.quizName) {
      alert('Please enter a quiz name.');
      return;
    }
    if (!this.startDate || !this.endDate) {
      alert('Please enter both start and end dates.');
      return;
    }
    if (new Date(this.endDate) <= new Date(this.startDate)) {
      alert('End date must be later than start date.');
      return;
    }
 
    // Create quiz object
    const quiz = {
      quizName: this.quizName,
      startDate: this.startDate,
      endDate: this.endDate
    };
 
    console.log('Quiz to be sent:', quiz);
    console.log('Course ID:', this.courseId);
 
    // Send quiz data to backend
    this.fusionService.saveQuiz(this.courseId, this.teacherId, quiz).subscribe(
     {next:(response) => {
        console.log('Quiz created successfully:', response);
        this.quizId = response.id;
        console.log(this.quizId);
        alert('Quiz created successfully!');
        this.isQuizCreated = true; // Enable questions section if necessary
        // Reset form fields
        this.quizName = '';
        this.startDate = '';
        this.endDate = '';
      },
      error:(error) => {
        console.error('Unable to create quiz', error);
        alert('Unable to create quiz. Please try again.');
      }}
    );
  }
  
  submitQuiz() {
    const quizId = this.quizId; // Replace with the actual quiz ID
    this.fusionService.addQuestionsToQuiz(quizId, this.questions).subscribe(
      {next:(response) => {
        console.log('Quiz submitted successfully', response);
        alert('Quiz questions posted successfully!');
      },
      error:(error) => {
        console.error('Error submitting quiz', error);
        alert('Unable to post the Questions. Please try again.');
      }}
    );
  }
 
 
  setMinDateTime() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // Adjust for timezone
    this.minDateTime = now.toISOString().slice(0, 16); // Format to YYYY-MM-DDTHH:MM
    this.minEndDate = this.minDateTime; // Ensure end date is at least now
  }
 
  updateEndDateMin() {
    if (this.startDate) {
      this.minEndDate = this.startDate; // End Date must be greater than or equal to Start Date
    }
  }
}
 
 