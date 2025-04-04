import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JobRecruiterService } from '../../job-recruiter.service';
import { ActivatedRoute, Router } from '@angular/router';
 
 
 
interface Question {
  // id?: number;
  jobQuizId:number;
//  jobId:any;
  questionText: string;
  options: string[];
  correctAnswer: number; // Index of the correct answer
}
 
@Component({
  selector: 'app-quizlevel',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './quizlevel.component.html',
  styleUrl: './quizlevel.component.css'
})
export class QuizlevelComponent implements OnInit {
  responseId: any;
  JobID?: any;
  questionText = '';
  isQuestionInvalid = false; // Question validation flag
  isOptionsInvalid = false; // Options validation flag
  isCorrectAnswerInvalid = false; // Correct answer validation flag
 
  options = [
    { id: 1, value: '', isInvalid: false },
    { id: 2, value: '', isInvalid: false },
    { id: 3, value: '', isInvalid: false },
    { id: 4, value: '', isInvalid: false },
  ];
 
  correctAnswerIndex: number | null = null;
  questions: any[] = [];
 
  constructor(
    private jobRecruiterService: JobRecruiterService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}
 
  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.responseId = params.get('responseId');
      this.JobID = Number(params.get('JobId'));
      console.log(this.responseId, 'quizid');
    });
  }
 
  // Validate the question text length
  validateQuestion() {
    this.isQuestionInvalid =
      this.questionText.trim().length < 10 || this.questionText.trim().length > 1500;
  }
 
  // Validate answer options
  validateOptions() {
    let isAnyOptionInvalid = false;
    this.options.forEach(option => {
      if (option.value.trim().length < 1 || option.value.trim().length > 500) {
        option.isInvalid = true;
        isAnyOptionInvalid = true;
      } else {
        option.isInvalid = false;
      }
    });
 
    this.isOptionsInvalid = isAnyOptionInvalid;
  }
 
  // Validate correct answer selection
  validateCorrectAnswer() {
    this.isCorrectAnswerInvalid = this.correctAnswerIndex === null;
  }
 
  // Add question to the list with validation
  addQuestion() {
    this.validateQuestion();
    this.validateOptions();
    this.validateCorrectAnswer();
 
    // Prevent adding an invalid question
    if (this.isQuestionInvalid || this.isOptionsInvalid || this.isCorrectAnswerInvalid) {
      return;
    }
 
    // Add question
    this.questions.push({
      question: this.questionText,
      options: this.options.map(opt => opt.value),
      correctAnswer: this.correctAnswerIndex,
    });
 
    // Reset form fields
    this.questionText = '';
    this.isQuestionInvalid = false;
    this.isOptionsInvalid = false;
    this.isCorrectAnswerInvalid = false;
    this.options = [
      { id: 1, value: '', isInvalid: false },
      { id: 2, value: '', isInvalid: false },
      { id: 3, value: '', isInvalid: false },
      { id: 4, value: '', isInvalid: false },
    ];
    this.correctAnswerIndex = null;
  }
 
  // Edit an existing question
  editQuestion(index: number) {
    const question = this.questions[index];
    this.questionText = question.question;
    this.options = question.options.map((value: any, idx: number) => ({
      id: idx + 1,
      value: value,
      isInvalid: false,
    }));
    this.correctAnswerIndex = question.correctAnswer;
    this.deleteQuestion(index); // Remove the question to allow editing
  }
 
  // Remove a question from the list
  deleteQuestion(index: number) {
    this.questions.splice(index, 1);
  }
 
  // Submit the quiz questions
  submitQuiz(jobQuizId: any) {
    const questionsData = this.questions.map(q => ({
      text: q.question,
      optionA: q.options[0],
      optionB: q.options[1],
      optionC: q.options[2],
      optionD: q.options[3],
      correctAnswer: q.options[q.correctAnswer],
    }));
 
    this.jobRecruiterService.submitQuizQuestions(this.JobID, jobQuizId, questionsData).subscribe(
     {next:response => {
        console.log('Quiz submitted successfully:', response);
        alert('Quiz submitted successfully!');
        this.questions = []; // Clear questions list after submission
        this.location.back();
      },
      error:error => {
        console.error('Error submitting quiz:', error);
        alert('Failed to submit the quiz. Please try again.');
      }}
    );
  }
}
 
 
 
 