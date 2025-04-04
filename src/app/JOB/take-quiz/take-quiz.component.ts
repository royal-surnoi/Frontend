import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobUserService, Result, QuizDetail  } from '../../job-user.service';
 
import { ActivatedRoute } from '@angular/router';
 
 
@Component({
  selector: 'app-take-quiz',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './take-quiz.component.html',
  styleUrls: ['./take-quiz.component.css'],
})
export class TakeQuizComponent implements OnInit,OnDestroy {
 
  selectedAnswers: { [key: number]: string } = {}; // Explicitly typed
  isOverlayVisible = false;
  attemptedQuestions = 0;
  errorMessage = '';
  apiError = '';
  quizDetails: QuizDetail[] = [];
  userId: number = 0;
  jobId: number = 0;
  jobQuizId: any ; // Ensure this is initialized as undefined
 
  isSubmitted: boolean = false;
 
  constructor(private jobUserService: JobUserService, private route: ActivatedRoute, private Location : Location) {}
 
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.jobId = +params['Jobid'];
    });
 
    this.userId = +localStorage.getItem('id')!;
 
    this.startDevToolsDetection();
    this.fetchQuizDetails();
  }
 
  ngOnDestroy(){
    this.stopDevToolsDetection();
  }
 
 
 
  fetchQuizDetails(): void {
    console.log('Fetching quiz details with userId:', this.userId);
    console.log('Fetching quiz details with jobId:', this.jobId);
    this.jobUserService.getUserJobQuizzes(this.jobId, this.userId).subscribe(
      {next:(data) => {
        if (data && data.length > 0) {
          const filteredQuizzes: any[] = [];
          let pendingRequests = data.length;
   
          data.forEach((quiz) => {
            this.jobUserService.isJobQuizzesAnsered(quiz.jobQuizId, this.userId)
              .subscribe(
                {next:(isAnswered) => {
                  if (!isAnswered) {
                    filteredQuizzes.push(quiz); // Keep only unanswered quizzes
                  }
                  pendingRequests--;
   
                  // Assign quiz details once all requests are completed
                  if (pendingRequests === 0) {
                    this.quizDetails = filteredQuizzes;
                    if (this.quizDetails.length > 0) {
                      this.jobQuizId = this.quizDetails[0].jobQuizId; // Assign first available quiz
                      console.log("Filtered Quiz Details:", this.quizDetails);
                    } else {
                      this.apiError = 'No available quizzes to attend.';
                      console.error(this.apiError);
                    }
                  }
                },
                error:(error) => {
                  console.error('Error checking quiz status:', error);
                  pendingRequests--;
                }}
              );
          });
        } else {
          this.apiError = 'No quizzes found for the given user.';
          console.error(this.apiError);
        }
      },
      error:(error) => {
        this.apiError = 'Error fetching quiz details: ' + error.message;
        console.error(this.apiError);
      }}
    );
   
  }
 
  selectOption(questionId: number, selectedAnswer: string): void {
    this.selectedAnswers[questionId] = selectedAnswer; // Map answer to the correct question ID
    console.log(`Selected answer for question ${questionId}: ${selectedAnswer}`);
  }
 
 
 
 
  submitQuiz(): void {
    this.attemptedQuestions = Object.keys(this.selectedAnswers).length;
 
    if (this.attemptedQuestions === 0) {
      this.errorMessage = 'Please attempt at least one question before submitting.';
      return;
    }
 
    this.errorMessage = '';
    this.isOverlayVisible = true;
  }
 
  closeOverlay(): void {
    this.isOverlayVisible = false;
  }
 
 
  onYes(): void {
    // Ensure jobQuizId and userId are defined before submitting
    if (!this.jobQuizId || !this.userId) {
      console.log('userId:', this.userId);
      console.log('jobQuizId:', this.jobQuizId);
      console.log('Missing jobQuizId or userId');
      alert('Quiz ID or User ID is missing.');
      return;
    }
 
    console.log('jobQuizId:', this.jobQuizId);
    console.log('userId:', this.userId);
 
    // Construct the results array using question.id from selectedAnswers
    const results: Result[] = Object.entries(this.selectedAnswers).map(([key, value]) => ({
      questionId: Number(key), // Convert key to number
      selectedAnswer: value, // Access selected answer
    }));
    console.log('Selected Answers:', this.selectedAnswers);
 
    console.log('Results being submitted:', results);
 
    this.jobUserService.submitAnswersWithPercentage(this.jobQuizId, this.userId, results).subscribe(
      {next:(response) => {
        console.log('Submission successful:', response);
        alert('Quiz submitted successfully!');
        this.isOverlayVisible = false;
        this.isSubmitted = true;
        if(this.quizDetails.length>1){
          window.location.reload();
        }
        else{
          this.Location.back();
        }
      },
      error:(error) => {
        console.error('Error submitting quiz:', error);
        alert('Failed to submit quiz. Please try again.');
      }}
    );
  }
 
 
 
 
  // Method to handle the "Cancel" button click.
  onCancel(): void {
    console.log('Cancel button clicked');
    this.isOverlayVisible = false; // Close the overlay or handle logic for "Cancel".
  }
 
  closeSuccessPopup(): void {
    this.isSubmitted = false; // Hide the success message popup
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