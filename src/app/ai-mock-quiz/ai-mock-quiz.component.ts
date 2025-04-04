import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
 
interface Question {
  text: string;
  options: { [key: string]: string };
  correct_answer: string;
  user_answer?: string;
}
 
@Component({
  selector: 'app-ai-mock-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-mock-quiz.component.html',
  styleUrl: './ai-mock-quiz.component.css'
})
export class AiMockQuizComponent {
  jobRole!: string;
  jobDescription!: string;
  experience!: number;
  questions: Question[] = [];
  loading = false;
  errorMessage = '';
  quizSubmitted = false;
  score = 0;
  showResults = false;
  unansweredQuestions: number[] = [];
 
 
  constructor(private route: ActivatedRoute, private router:Router,private http: HttpClient,private cdr: ChangeDetectorRef) {}
 
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.jobRole = params['job_role'];
      this.jobDescription = decodeURIComponent(params['job_description']);
      this.experience = +params['experience']; // Convert to number
      this.fetchQuestions();
    });
  }
  fetchQuestions() {
    this.loading = true;
    const apiUrl = 'http://localhost:8000/mock_assignment';
    const requestBody = {
      job_role: this.jobRole,
      job_description: this.jobDescription,
      experience: this.experience
    };
    console.log(requestBody);
 
    this.http.post<{ questions: any[] }>(apiUrl, requestBody).subscribe({
      next: (response) => {
        this.questions = response.questions;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load questions. Please try again.';
        console.error('API Error:', error);
        this.loading = false;
      }
    });
  }
 
  getOptions(question: any) {
    return Object.keys(question.options).map(key => ({
      key,
      value: question.options[key]
    }));
  }
 
  selectAnswer(questionIndex: number, answer: string) {
    this.questions[questionIndex].user_answer = answer;
  }
 
  submitQuiz() {
    // Check if all questions are answered
    this.unansweredQuestions = [];
   
    for (let i = 0; i < this.questions.length; i++) {
      if (!this.questions[i].user_answer) {
        this.unansweredQuestions.push(i + 1);
      }
    }
 
    if (this.unansweredQuestions.length > 0) {
      // Scroll to the top where validation message is shown
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return; // Don't submit if there are unanswered questions
    }
 
    // Calculate score
    this.score = 0;
    for (const question of this.questions) {
      if (question.user_answer === question.correct_answer) {
        this.score++;
      }
    }
 
    this.quizSubmitted = true;
    this.showResults = true;
    // Scroll to results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  getScorePercentage() {
    return Math.round((this.score / this.questions.length) * 100);
  }
 
  resetQuiz() {
    window.location.reload();
  }
 
  isCorrect(question: any): boolean {
    return question.user_answer === question.correct_answer;
  }
}
 