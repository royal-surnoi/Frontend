import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';
 
// Enum for submission status
enum SubmissionStatus {
  Initial,
  Loading,
  Success,
  Error
}
 
interface FeedbackData {
  jobName: string;
  candidateName: string;
  feedbackText: string;
  score: number | null;
}
@Component({
  selector: 'app-levelfeedback',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './levelfeedback.component.html',
  styleUrl: './levelfeedback.component.css'
})
export class LevelfeedbackComponent implements OnInit {
  // Feedback data object
  feedback: FeedbackData = {
    jobName: '',
    candidateName: '',
    feedbackText: '',
    score: null
  };
 
  // Submission status management
  submissionStatus: SubmissionStatus = SubmissionStatus.Initial;
  SubmissionStatus = SubmissionStatus; // Expose enum to template
 
  // Error handling
  errorMessage: string = '';
 
  // Debug information
  debugInfo: any = {};
 
  // Route parameters
  recruiterId: string | null = null;
  shortlistId: string | null = null;
  candidateUserId: string | null = null;
  jobId: string | null = null;
  interviewId: any;
 
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}
 
  ngOnInit(): void {
    this.extractRouteParameters();
    this.fetchInterviewDetails();
  }
 
  // Extract route parameters
  extractRouteParameters(): void {
    this.recruiterId = this.route.snapshot.paramMap.get('recruiterId');
    this.shortlistId = this.route.snapshot.paramMap.get('shortlistId');
    this.candidateUserId = this.route.snapshot.paramMap.get('candidateUserId');
    this.jobId = this.route.snapshot.paramMap.get('jobid');
 
    this.debugInfo = {
      recruiterId: this.recruiterId,
      shortlistId: this.shortlistId,
      candidateUserId: this.candidateUserId,
      jobId: this.jobId
    };
 
    console.log('Route Parameters:', this.debugInfo);
  }
 
  // Fetch interview details
  fetchInterviewDetails(): void {
    this.submissionStatus = SubmissionStatus.Loading;
    const url = `${environment.apiBaseUrl}/api/interviewDetails/${this.jobId}/user/${this.candidateUserId}`
    this.http.get(url).pipe(
      catchError((error: HttpErrorResponse) => {
        this.submissionStatus = SubmissionStatus.Error;
        this.errorMessage = this.getErrorMessage(error);
        return throwError(() => error);
      })
    ).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        this.interviewId = response[0].id;
        const jobDetails = response[0].job;
        const userName = response[0].userName;
        this.feedback.jobName = jobDetails.jobTitle;
        this.feedback.candidateName = userName;
        this.submissionStatus = SubmissionStatus.Initial;
      }
    );
  }
 
  // Submit feedback
  submitScoreFeedback(interviewId:any): void {
    // Validate input
    if (!this.feedback.feedbackText || this.feedback.score === null) {
      this.submissionStatus = SubmissionStatus.Error;
      this.errorMessage = 'Please provide both feedback and a score.';
      return;
    }
 
    // Reset previous states
    this.submissionStatus = SubmissionStatus.Loading;
    this.errorMessage = '';
 
    // Create FormData
    const formData = new FormData();
    formData.append('interviewId', interviewId);
    formData.append('interviewerScore', this.feedback.score.toString());
    formData.append('interviewerFeedback', this.feedback.feedbackText);
 
    // Send POST request
   
    this.http.post( `${environment.apiBaseUrl}/api/interviews/save-score-feedback`, formData, {
      responseType: 'text'
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.submissionStatus = SubmissionStatus.Error;
        this.errorMessage = this.getErrorMessage(error);
        return throwError(() => error);
      }),
      finalize(() => {
        // Ensure loading state is always turned off
        if (this.submissionStatus === SubmissionStatus.Loading) {
          this.submissionStatus = SubmissionStatus.Initial;
        }
      })
    ).subscribe(
      (response: string) => {
        console.log('Submission Response:', response);
        this.submissionStatus = SubmissionStatus.Success;
      }
    );
  }
 
  // Form submission handler
  onSubmit(interivewId:any): void {
    this.submitScoreFeedback(interivewId);
  }
 
  // Helper method to extract meaningful error message
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Error: ${error.error.message}`;
    } else {
      // Server-side error
      return `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
  }
 
  // Reset form method
  resetForm(): void {
    this.feedback = {
      jobName: this.feedback.jobName,
      candidateName: this.feedback.candidateName,
      feedbackText: '',
      score: null
    };
    this.submissionStatus = SubmissionStatus.Initial;
    this.errorMessage = '';
  }
}
