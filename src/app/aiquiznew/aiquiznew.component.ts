import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../course.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aiquiznew',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './aiquiznew.component.html',
  styleUrl: './aiquiznew.component.css'
})
export class AiquiznewComponent implements OnInit,OnDestroy {
  requestBody = {
    user_id: 0,
    course_id: 0,
    lesson_id: 0
  };

  quizData: any = null;
  quizForm: FormGroup;
  quizId: number | null = null;
  submitted = false;
  loading = false;
  quizResult: any;
  quizInterface = true;
  showSuccessPopup: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private fb: FormBuilder
  ) {
    this.quizForm = this.fb.group({});
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.requestBody.user_id = Number(params['userId']);
      this.requestBody.course_id = Number(params['courseId']);
      this.requestBody.lesson_id = Number(params['lessonId']);
    });
    this.startDevToolsDetection();
    this.generateQuiz();
  }
 
  ngOnDestroy(){
    this.stopDevToolsDetection();
  }

  generateQuiz() {
    this.loading = true;
    console.log('Generating quiz with request body:', this.requestBody);
    this.courseService.generateQuiz(this.requestBody).subscribe(
      {next:response => {
        console.log('Quiz generated successfully:', response);
        this.loading = false;
        if (response.quiz_id) {
          this.quizId = response.quiz_id;
          this.quizData = response;
          this.createQuizForm();
          this.postQuestions();
        }
      },
      error:(error) => {
        this.loading = false;
        console.error('Error generating quiz:', error);
      }}
    );
  }

  createQuizForm() {
    console.log('Creating form controls for each question.');
    this.quizData.questions.forEach((_: any, index: any) => {
      this.quizForm.addControl(`question_${index}`, this.fb.control(''));
    });
  }

  postQuestions() {
    if (!this.quizId || !this.quizData) {
      console.error('Quiz ID or quiz data is missing. Cannot post questions.');
      return;
    }

    console.log('Posting questions for quiz ID:', this.quizId);
    this.quizData.questions.forEach((question: any, index: number) => {
      const questionData = {
        AIOption1: question.options[0],
        AIOption2: question.options[1],
        AIOption3: question.options[2] || null,
        AIOption4: question.options[3] || null,
        AIQuizCorrectAnswer: question.correct_answer,
        AIQuizQuestion: question.text,
        AIQuizAnswerDescription: question.explanation
      };

      this.courseService.postQuizQuestion(this.quizId, questionData).subscribe(
        {next:postResponse => {
          console.log(`Posted question ${index + 1}/${this.quizData.questions.length}:`, postResponse);
          question.id = postResponse.id; // Assign the returned ID to the question
        },
        error:(error) => {
          console.error(`Error posting question ${index + 1}:`, error);
        }}
      );
    });
  }

  submitQuiz() {
    if (this.submitted || !this.quizId) {
      console.warn('Quiz already submitted or quiz ID is missing.');
      return;
    }
  
    this.loading = true;
    console.log('Submitting quiz answers.');
    const answers = this.quizData.questions.map((_: any, index: string | number) => ({
      aiQuizQuestionId: this.quizData.questions[index].id ,
      AIQuizUserAnswer: this.quizForm.get(`question_${index}`)?.value
    }));
  
    this.courseService.submitAIQuizAnswers(this.quizId, this.requestBody.user_id, answers).subscribe(
      {next:response => {
        console.log('Quiz submission successful:', response);
        this.loading = false;
        this.submitted = true;
        this.showSuccessPopup = true;
        this.getQuizResult();
        this.quizInterface = false;
      },
      error:(error) => {
        console.error('Error submitting quiz:', error);
        this.loading = false;
        alert('Error submitting quiz. Please try again.');
      }}
    );
  }
  
  closePopup(){
    this.showSuccessPopup = false;
  }

  getQuizResult() {
    if (!this.quizId) {
      console.warn('Quiz ID is missing. Cannot fetch results.');
      return;
    }

    console.log('Fetching quiz results for quiz ID:', this.quizId);
    this.courseService.getQuizResult(this.quizId, this.requestBody.user_id).subscribe(
      {next:result => {
        console.log('Quiz result fetched successfully:', result);
        this.quizResult = result;
      },
      error:(error) => {
        console.error('Error fetching quiz result:', error);
      }}
    );
  }

  private devToolsInterval: any;
  private resizeListener: (() => void) | undefined;
    // Start DevTools detection logic
  private startDevToolsDetection(): void {
    // Detect DevTools using timing (debugger)
    this.devToolsInterval = setInterval(() => {
      const start = performance.now();
      debugger; // Pauses if DevTools is open
      const duration = performance.now() - start;
 
      if (duration > 100) {
        this.handleCheatingDetected();
      }
    }, 1000);
 
    // Detect DevTools using window resize
    this.resizeListener = () => {
      const threshold = 100;
      if (
        Math.abs(window.outerHeight - window.innerHeight) > threshold ||
        Math.abs(window.outerWidth - window.innerWidth) > threshold
      ) {
        this.handleCheatingDetected();
      }
    };
 
    window.addEventListener('resize', this.resizeListener);
  }
 
  // Stop DevTools detection logic
  private stopDevToolsDetection(): void {
    if (this.devToolsInterval) {
      clearInterval(this.devToolsInterval);
      this.devToolsInterval = null;
    }
 
    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }
 
  // Handle actions when cheating is detected
  private handleCheatingDetected(): void {
    alert('Cheating detected! You are not allowed to use DevTools.');
    // Optionally, navigate away or restrict the quiz
    // Example: Navigate to another page
    // window.location.href = '/warning';
  }
 
  @HostListener('contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault(); // Disable right-click
  }
 
  @HostListener('window:keydown', ['$event'])
onKeyDown(event: KeyboardEvent) {
  if (event.ctrlKey && (event.key === 'i' || event.key === 'I' || event.key === 'j' || event.key === 'J' || event.key === 'u' || event.key === 'U' || event.key === 's' || event.key === 'S')) {
    event.preventDefault();
  }
 
  if (event.key === 'F12') {
    event.preventDefault();
  }
}
 
}