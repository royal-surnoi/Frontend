import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JobRecruiterService } from '../../job-recruiter.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface Applicant {
  total_score: number;
  selected: any;
  userId: number;
  user_id: number;
  name: string;
  user_name: string
  userName: string;
  userEmail: string;
  user_email: any;
  university: string;
  applicationStatus: string;
  profilePicture: string;
  status: string;
  profileMatch: number;
  userImage: string | SafeUrl; // Ensure this includes the `userImage` field
  resume: string;
  createdAt: number[];
  educationDetails: EducationDetails[];
  applicantId: number;
  recruiterId: number;
  vacancyCount?: number;
  user_image: string | SafeUrl;

}

export interface JobInterviewDetails {
  id: number;
  job: any;
  userId: number;
  userName: string;
  userEmail: string;
  recruiterId: number;
  recruiterName: string;
  recruiterEmail: string;
  interviewTimestamp: string | null;
  interviewLink: string | null;
  interviewScoreLink: string | null;
  interviewDescription: string | null;
  interviewerEmail: string | null;
  interviewerName: string | null;
  interviewerScore: number | null;
  interviewerFeedback: string | null;
  currentLevel: string;
  upcomingLevel: string;
  currentFeedback: string;
}


export interface UserData {
  userName: string;
  userEmail: string;
  scorePercentage: number;
  completedAt: number[]; // The date is stored as an array [year, month, day, hour, minute, second, timestamp]
  userImage?: string | SafeUrl; // Optional: Image can be a URL or Base64 string
}


export interface ShortlistedApplicant {
  name: string;
  email: string;
  shortlistedAt: string;
  profilePicture: string | SafeUrl;
}


interface EducationDetails {
  graduationCollegeSpecialization: string;
  postGraduateCollegeSpecialization: string;
}


export interface AssignQuizRequest {
  quizName: string;        // The name of the quiz
  startDate: string;       // The start date of the quiz (formatted as a string)
  endDate: string;         // The end date of the quiz (formatted as a string)
  shortlistedIds: number[]; // List of shortlisted IDs (numbers)
  userIds: number[];       // List of user IDs (numbers) - Add this property
}

export interface JobQuizResponse {
  id: number;
  quizName: string;
  startDate: string;
  endDate: string;
  recruiterId: number;
  shortlistedIds: number[];
}



export interface ShortlistResponse {
  success: ShortlistSuccess[];
  failed: ShortlistFailure[];
}

export interface ShortlistSuccess {
  jobId: number;
  id: number;
  applicantId: number;
  status: string;
  shortlistedAt: [number, number, number, number, number, number, number]; // [year, month, day, hour, minute, second, nanoseconds]
}

export interface ShortlistFailure {
  reason: string;
  applicantId: string; // Keep it as string since "applicantId" in "failed" is a string
}



@Component({
  selector: 'app-recruiter-application',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recruiter-application.component.html',
  styleUrl: './recruiter-application.component.css'
})
export class RecruiterApplicationComponent {
  jobId: number = 0;
  showModal: boolean = false;
  selectedApplicant: any = null; // Holds the applicant to be shortlisted
  vacancyCount?: number;
  appliedCount?: number;
  
  applicants: Applicant[] = [];
  shortlistedapplicants: any[] = [];
  educationDetails: Applicant[] = [];
  userImage: SafeUrl = '';  // Declare companyLogo as SafeUrl type
  // pdfUrl: string | null = null;
  // sanitizedPdfUrl: SafeUrl | null = null;
  showResumeModal: boolean = false; // Controls visibility of the modal
  sanitizedPdfUrl: SafeResourceUrl | null = null; // Stores the sanitized PDF URL
  isPopupOpen = false; /*shortlist button popup*/
  isStatusPopupOpen = false; /*status button popup*/
  selectedCandidates: Applicant[] = []; // Define the property.
  shortlistedCandidates: any;
  shortlistedIds: any;
  shortlistedIds1: number[] = [];
  shortlisteduserId: number[] = [];

  userName: string = '';
  userEmail: string = '';
  completedAt: any = [];
  userData: any = [];
  scorePercentage: number | null = null;
  isshortlistedloaded: boolean = false;
  isappliacntsloacded: boolean = false;


  // Make sure this is set to true if the button should be shown.
  openShortlistmultiple: boolean = false;  // Initially, the popup is closed.


  selectedApplicants: Applicant[] = [];
  // selectAllChecked: boolean = false;
  showCards = false;
  showAppliedCards = false;
  userId: any;
jobdata:any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private jobRecruiterService: JobRecruiterService, private sanitizer: DomSanitizer, private router: Router
  ) {
    this.updateForm = this.fb.group({
      interviewerName: ['', Validators.required],
      interviewerEmail: ['', [Validators.required, Validators.email]],
      interviewDescription: ['', Validators.required],
      interviewTimestamp: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobId = +params['Jobid'];
    });

    this.jobRecruiterService.getJobByJobId(this.jobId).subscribe(
      {next:(response) => {
        this.isappliacntsloacded = true;
        console.log(response);
        if (response.vacancyCount) {
          this.vacancyCount = response.vacancyCount;
          this.appliedCount = response.appliedCount;
        }

        this.allStatusOptions = Array.from({ length: response.numberOfLevels }, (_, i) => `level-${i + 1}`);
        this.allStatusOptions.push('shortlisted', 'Rejected', 'Accepted');
      },
      error:(error) => {
        console.error('Error fetching jobdetails:', error);
      }}
    );


    // Fetch shortlisted candidates with sanitized profile picture




    this.jobRecruiterService.getApplicationsByJobIdAI(this.jobId).subscribe(
      {next:(response) => {
        // Map applicants and sanitize each applicant's image
        this.applicants = response.applicants.map((applicant: Applicant) => {
          return {
            ...applicant,
            userImage: this.sanitizer.bypassSecurityTrustUrl(
              `data:image/png;base64,${applicant.user_image}`
            ),
            status: applicant.status || '',
          };
        });
      },
      error:(error) => {
        console.error('Error fetching applicants:', error);
      }}
    );

   

    this.getUserData();

    this.getRecruiterIdFromStorage();
  }

  getUserData(): void {
    const recruiterId = localStorage.getItem('recruiterId');
    const jobId = this.jobId;
  
    if (recruiterId && jobId) {
      this.jobRecruiterService.getShortlistedCandidates(jobId).subscribe({
        next:(shortlistedResponse) => {
          this.shortlistedapplicants = shortlistedResponse.shortlistedCandidates.map((applicant: any) => {
            return {
              ...applicant,
              userImage: this.sanitizer.bypassSecurityTrustUrl(
                `data:image/png;base64,${applicant.userImage}`
              )
            };
          });
  
          console.log('Shortlisted Candidates:', this.shortlistedapplicants);
  
          // Call User Quiz Results API
          this.jobRecruiterService.getUserData(recruiterId, jobId).subscribe({
            next:(userDataResponse) => {
              this.userData = userDataResponse;
              console.log(this.userData)
  
              // Merge Quiz Results with Shortlisted Data (Only Level 1 Candidates)
              this.shortlistedapplicants = this.shortlistedapplicants.map((applicant: any) => {
                if (applicant.applicantStatus === 'level-1') {
                  const quizResult = this.userData.find((user: any) => user.userId === applicant.userId);
  
                  if (quizResult) {
                    return {
                      ...applicant,
                      quizScore: quizResult.scorePercentage,
                      jobQuizName: quizResult.jobQuizName,
                      completedAt: quizResult.completedAt,
                      quizResult
                    };
                  }
                }
                return {
                  ...applicant,
                  quizScore: 'Not Available',
                  completedAt:"not yet Completed"
                };
              });
  
              console.log('Final Merged Data:', this.shortlistedapplicants);
            },
            error:(userDataError) => {
              console.error('Error fetching user data:', userDataError);
            }
          }
          );
        },
        error:(shortlistError) => {
          console.error('Error fetching shortlisted candidates:', shortlistError);
        }
      }
      );
    } else {
      console.error('Recruiter ID or Job ID not found in localStorage');
    }
  }
  


  image(toolImage: any) {
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${toolImage}`);

  }


  // Method to open feedback modal (dummy method for now)
  openlevelFeedbackModal(): void {
    console.log('Opening feedback modal');
  }








  goBack() {
    window.history.back();
  }

  formatPostedDate(createdAt: number[]): string {
    if (!createdAt || createdAt.length < 3) return 'Date unknown';
  
    const jobDate = new Date(createdAt[0], createdAt[1] - 1, createdAt[2]);
    const now = new Date();
  
    // Reset hours, minutes, seconds, and milliseconds to compare only dates
    jobDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
  
    const diffTime = now.getTime() - jobDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
  
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${Math.floor(diffDays)} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
  


  openResumeModal(pdfUrl: string): void {
    if (pdfUrl) {
      // Directly use the PDF URL in the iframe
      const sanitizedUrl = `data:application/pdf;base64,${pdfUrl}`;
      this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
      this.showResumeModal = true;
    } else {
      console.error('PDF URL is invalid or missing.');
      this.sanitizedPdfUrl = null;
      this.showResumeModal = false;
    }
  }

  closeResumeModal(): void {
    this.showResumeModal = false;
    this.sanitizedPdfUrl = null;
  }


  expandedCardIndex: number | null = null;

  toggleCard(index: number): void {
    this.expandedCardIndex = this.expandedCardIndex === index ? null : index;
  }

  // Toggle selection for a single applicant
  toggleSelection(applicant: Applicant): void {
    const index = this.selectedApplicants.findIndex(
      (selected) => selected.userId === applicant.userId
    );

    if (index > -1) {
      // If already selected, deselect
      this.selectedApplicants.splice(index, 1);
    } else {
      // Otherwise, select
      this.selectedApplicants.push(applicant);
    }

    this.updateSelectAllState();
  }

  // Check if an applicant is selected
  isSelected(applicant: Applicant): boolean {
    return (
      this.selectedApplicants.findIndex(
        (selected) => selected.userId === applicant.userId
      ) > -1
    );
  }



  // Update "Select All" checkbox state
  updateSelectAllState(): void {
    this.selectAllChecked =
      this.selectedApplicants.length === this.applicants.length;
  }


  toggleCards(): void {
    this.showCards = !this.showCards;

  }

  toggleAppliedCards(): void {
    this.showAppliedCards = !this.showAppliedCards;
  }





  /*-------------------new-------------------------------*/
  selectAllChecked: boolean = false; // Tracks "Select All" checkbox state
  SelectEnabled: boolean = false; // Tracks whether multi-select mode is enabled
  disableButtons: boolean = false; // Tracks the state of buttons
  showMultipleShortlist: boolean = false; // Tracks visibility of "Multiple Shortlist" button


  // Enables/disables multi-select mode
  toggleSelect() {
    this.SelectEnabled = !this.SelectEnabled;

    // Reset selections when disabling multi-select
    if (!this.SelectEnabled) {
      this.resetSelections();
    }

    // Show/hide the "Multiple Shortlist" button and disable individual buttons
    this.showMultipleShortlist = this.SelectEnabled;
    this.disableButtons = this.SelectEnabled; // Ensure buttons are disabled in multi-select mode
  }

  // Handles "Select All" functionality
  toggleSelectAll(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    this.selectAllChecked = checkbox.checked; // Set the "Select All" state based on checkbox value

    // Ensure multi-select mode is enabled when "Select All" is checked
    if (this.selectAllChecked) {
      this.SelectEnabled = true;
      this.showMultipleShortlist = true;
    } else if (!this.selectAllChecked && this.selectedApplicants.length === 0) {
      // Disable multi-select mode if no applicants are selected
      this.SelectEnabled = false;
      this.showMultipleShortlist = false;
    }

    // Disable buttons if multi-select mode is enabled
    this.disableButtons = this.SelectEnabled;

    // Apply the selection to all applicants
    this.applicants.forEach(
      (applicant) => (applicant.selected = this.selectAllChecked)
    );

    // Update selected applicants list
    this.updateSelectedApplicants();
  }

  // Updates the list of selected applicants
  updateSelectedApplicants() {
    this.selectedApplicants = this.applicants.filter(
      (applicant) => applicant.selected
    );
  }

  // Resets all selections when multi-select is disabled
  resetSelections() {
    this.selectAllChecked = false;
    this.applicants.forEach((applicant) => (applicant.selected = false));
    this.updateSelectedApplicants();
  }

  // -------------------------------------------------------------select select all for shorlist section-------------
  shortlistedSelectEnabled: boolean = false; // Enables or disables multi-select mode
  shortlistedSelectAllChecked: boolean = false; // Tracks the "Select All" checkbox state
  shortlistedDisableButtons: boolean = false; // Toggles button states for actions
  showShortlistedMultipleActions: boolean = false; // Shows multiple actions (e.g., "Take Quiz" for multiple candidates)
  selectedShortlistedApplicants: any[] = []; // Tracks selected shortlisted candidates
  disableTakeQuiz: boolean = false; // Disables individual "Take Quiz" buttons

  showNavbarTakeQuizButton: boolean = false; // Controls visibility of the navbar Take Quiz button


  // shortlistedapplicants: any[] = []; // List of shortlisted applicants

  // Toggles multi-select mode for shortlisted candidates
  toggleShortlistedSelect() {
    this.shortlistedSelectEnabled = !this.shortlistedSelectEnabled;
    this.showNavbarTakeQuizButton = this.shortlistedSelectEnabled; // Show the navbar Take Quiz button
    this.disableTakeQuiz = this.shortlistedSelectEnabled; // Disable individual Take Quiz buttons

    if (!this.shortlistedSelectEnabled) {
      this.resetShortlistedSelections(); // Reset selections when multi-select is disabled
      this.showNavbarTakeQuizButton = false; // Hide the navbar Take Quiz button
    }
  }

  updateShortlistedSelectedApplicants() {
    // Filter selected applicants
    this.selectedShortlistedApplicants = this.shortlistedapplicants.filter(
      (applicant) => applicant.selected
    );

    // Extract their IDs into `shortlistedIds1`
    this.shortlistedIds1 = this.selectedShortlistedApplicants.map(
      (applicant) => applicant.shortlistedCandidateId
    );
    this.shortlisteduserId = this.selectedShortlistedApplicants.map(
      (applicant) => applicant.userId
    );
    console.log('Selected Shortlisted Applicants:', this.selectedShortlistedApplicants);
    console.log('Updated Shortlisted IDs:', this.shortlistedIds1);
    console.log('updated user ids', this.shortlisteduserId);

  }


  onIndividualCheckboxChange() {
    // Update "Select All" checkbox
    this.updateSelectAllCheckbox();

    // Update the list of selected applicants and their IDs
    this.updateShortlistedSelectedApplicants();
  }

  // Toggles the "Select All" functionality
  toggleShortlistedSelectAll() {
    // Toggle the "Select All" checkbox state
    this.shortlistedSelectAllChecked = !this.shortlistedSelectAllChecked;

    // Update the selected state of all shortlisted applicants
    this.shortlistedapplicants.forEach(applicant => {
      applicant.selected = this.shortlistedSelectAllChecked;
    });

    // Show the Take Quiz button and disable individual buttons based on "Select All" state
    this.showNavbarTakeQuizButton = this.shortlistedSelectAllChecked;
    this.disableTakeQuiz = this.shortlistedSelectAllChecked;

    if (this.shortlistedSelectAllChecked) {
      this.shortlistedSelectEnabled = true;
      this.showNavbarTakeQuizButton = true;
    } else if (!this.shortlistedSelectAllChecked && this.selectedShortlistedApplicants.length === 0) {
      // Disable multi-select mode if no applicants are selected
      this.shortlistedSelectEnabled = false;
      this.showNavbarTakeQuizButton = true;
    }

    if (this.shortlistedSelectEnabled && !this.shortlistedSelectAllChecked) {
      this.showNavbarTakeQuizButton = true;
    }


    this.disableTakeQuiz = this.shortlistedSelectEnabled;


    // Update the list of selected applicants
    this.updateShortlistedSelectedApplicants();
  }

  // Resets selections for shortlisted candidates
  resetShortlistedSelections() {
    this.shortlistedapplicants.forEach(applicant => {
      applicant.selected = false;
    });
    this.shortlistedSelectAllChecked = false;
    this.updateShortlistedSelectedApplicants();
  }

  // Handles the action when the "Take Quiz" button is clicked from the navbar
  handleNavbarTakeQuiz() {
    const selectedApplicants = this.shortlistedapplicants.filter(applicant => applicant.selected);

    if (selectedApplicants.length > 0) {
      // Perform the action for the selected applicants (e.g., taking the quiz)
      console.log('Taking quiz for:', selectedApplicants);
    } else {
      alert('Please select at least one candidate to take the quiz.');
    }
  }

  // Update "Select All" checkbox based on individual selections
  updateSelectAllCheckbox() {
    // Check if all applicants are selected
    const allSelected = this.shortlistedapplicants.every(applicant => applicant.selected);

    // If all applicants are selected, check the "Select All" checkbox
    this.shortlistedSelectAllChecked = allSelected;

    // Update the list of selected applicants
    this.updateShortlistedSelectedApplicants();
  }


  /*-----------------------------------------------------------------------------------------------------------*/
  openShortlistPopup(applicant: any): void {
    this.selectedApplicant = applicant; // Set the clicked applicant
    this.isPopupOpen = true; // Open the popup
  }


  closeShortlistPopup() {
    this.isPopupOpen = false;
  }


  // Method to open the multiple shortlist popup
  openShortlistmultiplePopup(applicants: any[]) {
    // Filter selected applicants
    this.selectedCandidates = applicants.filter(applicant => applicant.selected);

    // Check if there are any selected applicants
    if (this.selectedCandidates.length > 0) {
      this.openShortlistmultiple = true; // Open the popup
    } else {
      alert('Please select at least one applicant.');
      this.openShortlistmultiple = false; // Close the popup
    }


  }

  // Remove a candidate from the list by index
  removeCandidate(index: number) {
    this.selectedCandidates.splice(index, 1);  // Remove the candidate at the specified index
  }

  // Close the popup
  closeShortlistmultiple() {
    this.openShortlistmultiple = false;  // Set the flag to false to close the popup
  }

  // This method handles shortlisting of all candidates
  mutlipleshortlistAllCandidates() {
    // Logic to shortlist all candidates
  }

  // Check if shortlist button should be disabled
  ismultipleShortlistDisabled() {
    return false; // Return true/false based on the business logic (e.g., if no candidates are selected).
  }






  closequizpopup() {
    this.isStatusPopupOpen = false;
  }

  openmultiplequiz() {
    this.isStatusPopupOpen = true;
  }

  closemultiplequiz() {
    this.isStatusPopupOpen = false;
  }
  quiz: {
    quizName: string;
    startDate: number[];  // Explicitly define as an array of numbers
    endDate: number[];    // Explicitly define as an array of numbers
} = {
    quizName: '',
    startDate: [],
    endDate: []
};
 
dateError: string | null = null;
titleError: string | null = null;
 
assignQuiz(shortlistedIdsNumber: any[], shortlistedUserId: any[], jobId: number) {
    const recruiterId = localStorage.getItem('recruiterId');
    if (!recruiterId) {
        alert('Recruiter ID is missing!');
        return;
    }
 
    const recruiterIdNumber = Number(recruiterId);
    if (isNaN(recruiterIdNumber)) {
        alert('Invalid Recruiter ID!');
        return;
    }
 
    if (!this.quiz.startDate.length || !this.quiz.endDate.length) {
        console.error('Invalid date values:', this.quiz.startDate, this.quiz.endDate);
        return;
    }
 
    if (!this.quiz.quizName) {
        console.error('Quiz name is required!');
        return;
    }
 
    const assignQuizRequest = {
        quizName: this.quiz.quizName,
        startDate: new Date(this.quiz.startDate[0]).toISOString().split('T')[0],
        endDate: new Date(this.quiz.endDate[0]).toISOString().split('T')[0],
        shortlistedIds: shortlistedIdsNumber,
        userIds: shortlistedUserId,
    };
 
    console.log(assignQuizRequest);
 
    this.jobRecruiterService.assignQuiz(assignQuizRequest, recruiterIdNumber, jobId).subscribe({
        next: (response) => {
            console.log('Quiz created successfully:', response);
            this.router.navigate(['quizlevel'], { queryParams: { responseId: response.id, jobId: jobId } });
        },
        error: (error) => {
            console.error('Error creating quiz:', error);
        },
    });
}
 
/**
 * Converts input date (string) to timestamp array and stores in quiz object.
 */
onDateChange(event: Event, field: 'startDate' | 'endDate') {
  const input = event.target as HTMLInputElement;
  if (!input.value) return;
 
  const timestamp: number = new Date(input.value).getTime();
  this.quiz[field] = [timestamp]; // Now TypeScript knows it's an array of numbers
 
  this.validateDates();
}
 
/**
 * Validates that startDate and endDate are in the future and endDate > startDate.
 */
validateDates() {
    const today = new Date().getTime();
 
    const startDate = this.quiz.startDate.length ? this.quiz.startDate[0] : null;
    const endDate = this.quiz.endDate.length ? this.quiz.endDate[0] : null;
 
    if (startDate && startDate < today) {
        this.dateError = 'Start date must be in the future.';
        return;
    }
 
    if (endDate && endDate < today) {
        this.dateError = 'End date must be in the future.';
        return;
    }
 
    if (startDate && endDate && endDate <= startDate) {
        this.dateError = 'End date must be after start date.';
        return;
    }
 
    this.dateError = null;
}
 
validateTitle() {
    if (this.quiz.quizName.length > 100) {
        this.titleError = 'Quiz title cannot exceed 100 characters.';
    } else {
        this.titleError = null;
    }
}
 
 
 
  isShortlistDisabled(): boolean {
    return this.selectedCandidates.some(candidate => candidate.status === 'shortlisted');
  }



  /*--------post method for shortlist---------*/

  shortlistApplicant(applicant: Applicant): void {
    const jobId = this.jobId; // Ensure `jobId` is defined in your component
    const applicantId = applicant.applicantId;

    // Retrieve recruiterId from local storage
    const recruiterId = localStorage.getItem('recruiterId');


    // Validate recruiterId
    if (!recruiterId) {
      console.error('Recruiter ID not found in local storage.');
      alert('Recruiter ID is missing. Please log in again.');
      return;
    }

    const body = { status: 'shortlisted', recruiterId: recruiterId }; // Include recruiterId in the request body

    this.jobRecruiterService.shortlistApplicant(jobId, applicantId, body).subscribe({
      next: (response) => {
        console.log('Applicant shortlisted successfully:', response);

        // Update the applicant's status in the UI
        applicant.status = response.status;

        // Notify the user
        alert(`${applicant.user_name} has been shortlisted!`);
        window.location.reload();
        this.closeShortlistPopup();

      },
      error: (error) => {
        console.error('Error shortlisting applicant:', error);
        alert('Failed to shortlist applicant. Please try again.');
        this.closeShortlistPopup();
      },
    });
  }



  shortlistAllCandidates(): void {
    if (!this.selectedCandidates || !this.selectedCandidates.length) {
      alert('No candidates selected for shortlisting!');
      return;
    }

    const jobId = this.jobId;
    if (!jobId) {
      console.error('Job ID is missing!');
      alert('Unable to shortlist candidates: Job ID is undefined.');
      return;
    }

    const recruiterId = localStorage.getItem('recruiterId');
    if (!recruiterId) {
      console.error('Recruiter ID not found in local storage.');
      alert('Recruiter ID is missing. Please log in again.');
      return;
    }

    const applicantIds = this.selectedCandidates.map(candidate => candidate.applicantId);
    if (applicantIds.some(id => typeof id !== 'number')) {
      console.error('Invalid applicant IDs:', applicantIds);
      alert('Some applicant IDs are invalid. Please check your selection.');
      return;
    }

    const body = {
      applicantIds: applicantIds,
      status: 'shortlisted',
      recruiterId: recruiterId,
    };

    console.log('Initiating API call with:', body);


    this.jobRecruiterService.shortlistMultipleCandidates(jobId, body).subscribe({
      next: (response) => {
        console.log('Shortlisted successfully:', response);
        alert('All selected candidates have been shortlisted successfully!');
        window.location.reload();
        this.closeShortlistmultiple();
      },
      error: (error) => {
        if (error.status === 400) {
          console.error('Validation error from API:', error.error);
          alert(error.error?.error || 'Validation error while shortlisting candidates.');
        } else {
          console.error('Error in API call:', error);
          alert('Failed to shortlist candidates. Please try again.');
          this.closeShortlistmultiple();
        }
      },
    });
  }




  selectedStatus = 'shortlisted';
  filteredApplicants = this.shortlistedapplicants;
  allStatusOptions: string[] = [];





  showfeedbackModal: boolean = false;
  selectedApplicantforfeedback: any | null = null;
  upcomingLevel: string = '';
  currentFeedback: string = '';
  feedbackScore: number = 5;
  feedbackDate: string = '';

  // Add new fields for the next round
  nextRoundDate: string = '';
  nextRoundTime: string = '';
  nextRoundDetails: string = '';

  filteredStatusOptions: string[] = [];
  showlevel1: boolean = false;


  filterApplicants(): void {
    if (this.selectedStatus) {
      this.filteredApplicants = this.shortlistedapplicants.filter(
        applicant => applicant.status === this.selectedStatus
      );
      if (this.selectedStatus == 'level-1') {
        this.showlevel1 = true
      }
      else {
        this.showlevel1 = false
      }
      // Show Level-1 container if status matches
      this.showlevel1 = (this.selectedStatus === 'level-1');

    } else {
      this.filteredApplicants = this.shortlistedapplicants; // Show all if no status is selected
    }
  }


  filterStatusOptions(currentStatus: string | undefined): void {
    if (!currentStatus) {
      this.filteredStatusOptions = this.allStatusOptions.filter(option => !['Accepted', 'Rejected'].includes(option));
      return;
    }

    if (currentStatus === 'Shortlisted') {
      this.filteredStatusOptions = this.allStatusOptions.filter(option => option.startsWith('level') || ['Accepted', 'Rejected'].includes(option));
    } else if (currentStatus.startsWith('level')) {
      const currentLevel = parseInt(currentStatus.replace('level ', ''), 10);
      this.filteredStatusOptions = this.allStatusOptions.filter(option => {
        if (option.startsWith('level')) {
          const level = parseInt(option.replace('level ', ''), 10);
          return level > currentLevel;
        }
        return ['Accepted', 'Rejected'].includes(option);
      });
    } else {
      this.filteredStatusOptions = [];
    }
  }

  selectStatus(status: string): void {
    this.selectedStatus = status;
    this.filterApplicants();



  }

  getStatusCount(status: string): number {
    return this.shortlistedapplicants?.filter(applicant => applicant.status === status).length || 0;
  }



  tempapplicant?: Applicant;
  tempresp: any;
  openFeedbackModal(index: UserData, response: any): void {
    this.selectedApplicantforfeedback = index;
    this.getcurrentlist(this.selectedApplicantforfeedback?.status)
    this.upcomingLevel = this.selectedApplicantforfeedback?.status || '';
    this.filterStatusOptions(this.upcomingLevel);
    this.showfeedbackModal = true;
    this.tempresp = response;
  }

  closeFeedbackModal(): void {
    this.showfeedbackModal = false;
    this.selectedApplicantforfeedback = null;
    this.currentFeedback = '';
    this.feedbackScore = 5;
    this.feedbackDate = '';
    // Reset the next round fields
    this.nextRoundDate = '';
    this.nextRoundTime = '';
    this.nextRoundDetails = '';
  }

  submitFeedback(): void {
    if (this.selectedApplicantforfeedback) {
      const feedbackData = {
        status: this.upcomingLevel,
        feedback: this.currentFeedback,
        score: this.feedbackScore,
        date: this.feedbackDate,
        nextRoundDate: this.nextRoundDate,
        nextRoundTime: this.nextRoundTime,
        nextRoundDetails: this.nextRoundDetails,
        applicantName: this.selectedApplicantforfeedback.name,
      };

      console.log('Feedback submitted:', feedbackData);
      this.selectedApplicantforfeedback.status = this.upcomingLevel;
      this.closeFeedbackModal();
    }
  }


  filteredstatusoptions2?: string[];

  getcurrentlist(currentStatus: string) {
    if (!currentStatus) {
      this.filteredstatusoptions2 = this.allStatusOptions.filter(option => !['Accepted', 'Rejected'].includes(option));
      return;
    }

    if (currentStatus === 'Shortlisted') {
      this.filteredstatusoptions2 = this.allStatusOptions.filter(option => option.startsWith('level') || ['Accepted', 'Rejected'].includes(option));
    } else if (currentStatus.startsWith('level')) {
      const currentLevel = parseInt(currentStatus.replace('level ', ''), 10);
      this.filteredstatusoptions2 = this.allStatusOptions.filter(option => {
        if (option.startsWith('level')) {
          const level = parseInt(option.replace('level ', ''), 10);
          return level > currentLevel;
        }
        return ['Accepted', 'Rejected'].includes(option);
      });
    } else {
      this.filteredstatusoptions2 = [];
    }
    // return;
  }

  feedbackData: any;
  isprocesson :boolean = false;


  submitLevel1Feedback() {

    console.log(this.jobId)

    console.log(this.selectedApplicantforfeedback)

    this.isprocesson = true




    if (this.selectedApplicantforfeedback.quizResult != undefined) {
      console.log("stage 1")
      this.feedbackData = {
        job: {
          id: this.jobId,
        },
        userId: this.selectedApplicantforfeedback.quizResult.userId,
        userName: this.selectedApplicantforfeedback.quizResult.userName,
        userEmail: this.selectedApplicantforfeedback.quizResult.userEmail,
        recruiterId: this.selectedApplicantforfeedback.quizResult.recruiterId,
        recruiterName: this.selectedApplicantforfeedback.quizResult.recruiterName,
        recruiterEmail: this.selectedApplicantforfeedback.quizResult.recruiterEmail,
        interviewTimestamp: null,
        interviewLink: '',
        interviewScoreLink: '',
        interviewDescription: '',
        interviewerEmail: '',
        interviewerName: '',
        interviewerScore: null,
        interviewerFeedback: '',
        currentLevel: '',
        upcomingLevel: '',
        currentFeedback: this.currentFeedback,
      };
    }

    else {
      console.log("stage 2")

      this.feedbackData = {
        job: {
          id: this.jobId,
        },
        userId: this.tempresp.userId,
        userName: this.tempresp.userName,
        userEmail: this.tempresp.userEmail,
        recruiterId: this.tempresp.recruiterId,
        recruiterName: this.tempresp.recruiterName,
        recruiterEmail: this.tempresp.recruiterEmail,
        interviewTimestamp: null,
        interviewLink: '',
        interviewScoreLink: '',
        interviewDescription: '',
        interviewerEmail: '',
        interviewerName: '',
        interviewerScore: null,
        interviewerFeedback: '',
        currentLevel: '',
        upcomingLevel: '',
        currentFeedback: this.currentFeedback,
      };
    }



    console.log(this.feedbackData)



    const jobId = this.jobId;

    this.jobRecruiterService.submitFeedback(this.feedbackData, jobId).subscribe(
      {next:(response) => {
        console.log('Feedback submitted successfully:', response);
        alert('Feedback updated successfully!');
        this.isprocesson = false
        window.location.reload();     
        this.showfeedbackModal = false;
      },
      error:(error) => {
        this.isprocesson = false;
        console.error('Error submitting feedback:', error);
      }}
    );
  }



  // openquizpopup() {
  //   this.isStatusPopupOpen = true;
  // }

  openquizpopup(shortlistedid: number, userid: number) {
    this.shortlistedIds1.push(shortlistedid);
    this.shortlisteduserId.push(userid);
    alert("are you sure to assign quiz");
    // this.assignQuiz(this.shortlistedIds1, this.shortlisteduserId,jobId)
    this.isStatusPopupOpen = true;
  }


  islevel1FeedbackPopupVisible: boolean = false;
  level1currentFeedback: string = '';

  openlevel1Feedbackpopup() {
    this.islevel1FeedbackPopupVisible = true;
  }

  closelevel1FeedbackPopup() {
    this.islevel1FeedbackPopupVisible = false;
    this.currentFeedback = ''; // Clear the feedback text
  }

  // submitlevel1Feedback() {
  //   if (this.currentFeedback.trim()) {
  //     console.log('Feedback submitted:', this.currentFeedback);
  //     // Handle feedback submission (e.g., API call)
  //     this.closelevel1FeedbackPopup();
  //   } else {
  //     alert('Please enter your feedback before submitting.');
  //   }
  // }

  updateForm: FormGroup;
  showOverlay: boolean = false; // Control overlay visibility
  // selectedInterviewId: number = 11; // Replace with actual interview ID

  openOverlay(): void {
    this.showOverlay = true;
  }

  closeOverlay(): void {
    this.showOverlay = false;
  }

  onSubmit(): void {
    if (this.updateForm.valid) {
      this.isprocesson = true;
      const updatedDetails = this.updateForm.value;
      this.jobRecruiterService.updateInterviewDetails(this.selectedApplicantforfeedback.id, updatedDetails).subscribe(
        {next:(response) => {
          console.log('Interview details updated successfully:', response);
          alert('Interview details updated successfully!');
          this.isprocesson=false;
          this.closeOverlay();
        },
        error:(error) => {
          alert('Interview details updated successfully!');
          this.isprocesson=false;
          this.closeOverlay();
        }}
      );
    }
  }

  loading: boolean = false;



  handleOpenForm(applicant: any) {
    this.loading = true
    this.jobRecruiterService
      .getInterviewDetails(this.jobId, applicant.userId)
      .subscribe(
        {next:(response: any) => {
          this.loading = false
          console.log(response);
          if (response.interviewTimestamp == null) {
            this.selectedApplicantforfeedback = response;
            this.showOverlay = true; // Show the overlay dialog
          } else {
            this.openFeedbackModal(applicant, response); // Show feedback modal
          }
        },
        error:(error) => {
          console.error('Error fetching interview details:', error);
          // Handle API errors here
        }}
      );
  }

  jobAdminId!: number; // To store the fetched jobAdminId
  recruiterId!: number;
  recruitersGrouped: { [key: string]: Array<{ interviewerEmail: string; interviewerName: string; id: number }> } = {};
  recruiterRole = 'panelmember'; // Example recruiterRole

  getRecruiterIdFromStorage(): void {
    const recruiterIdFromStorage = localStorage.getItem('recruiterId');
    if (recruiterIdFromStorage) {
      this.recruiterId = +recruiterIdFromStorage; // Convert to number
      this.fetchJobAdminId();
    } else {
      console.error('Recruiter ID not found in local storage.');
    }
  }

  fetchJobAdminId(): void {
    this.jobRecruiterService.getJobAdminIdByRecruiterId(this.recruiterId).subscribe({
      next: (data) => {
        this.jobAdminId = data;
        console.log('Job Admin ID:', this.jobAdminId);
        this.getRecruiters(); // Fetch recruiters after jobAdminId is retrieved
      },
      error: (error) => {
        console.error('Error fetching job admin ID:', error);
      },
    });
  }



  getRecruiters(): void {
    this.jobRecruiterService.getRecruitersByJobAdminAndRole(this.jobAdminId, this.recruiterRole).subscribe({
      next: (data) => {
        // Transform data to match the expected type
        this.recruitersGrouped = Object.keys(data).reduce((acc, key) => {
          acc[key] = data[key].map((recruiter: any) => ({
            interviewerEmail: recruiter.recruiterEmail,
            interviewerName: recruiter.recruiterName,
            id: recruiter.id,
          }));
          return acc;
        }, {} as { [key: string]: Array<{ interviewerEmail: string; interviewerName: string; id: number }> });

        console.log('Recruiters grouped:', this.recruitersGrouped);
      },
      error: (error) => {
        console.error('Error fetching recruiters:', error);
      },
    });
  }


  selectedGroup: string | null = null; // Selected group key
  filteredRecruiters: Array<{ interviewerEmail: string; interviewerName: string; id: number }> | null = null;

  selectedRecruiter: string | null = null; // Selected interviewer's name
  selectedRecruiterDetails: { interviewerEmail: string; interviewerName: string; id: number } | null = null;

  onGroupChange(): void {
    if (this.selectedGroup && this.recruitersGrouped[this.selectedGroup]) {
      this.filteredRecruiters = this.recruitersGrouped[this.selectedGroup];
      this.selectedRecruiter = null; // Reset recruiter selection
      this.selectedRecruiterDetails = null; // Reset recruiter details
    } else {
      this.filteredRecruiters = null;
      this.selectedRecruiter = null;
      this.selectedRecruiterDetails = null;
    }
    this.updateForm.reset(); // Reset form fields
  }


  onRecruiterChange(): void {
    if (this.filteredRecruiters) {
      this.selectedRecruiterDetails = this.filteredRecruiters.find(
        (recruiter) => recruiter.interviewerName === this.selectedRecruiter
      ) || null;

      if (this.selectedRecruiterDetails) {
        // Populate form fields with selected recruiter details
        this.updateForm.patchValue({
          interviewerName: this.selectedRecruiterDetails.interviewerName,
          interviewerEmail: this.selectedRecruiterDetails.interviewerEmail,
        });
      }
    }
  }


  fetchApplicants(): void {
    this.jobRecruiterService.getApplicationsByJobIdAI(this.jobId).subscribe(
      {next:(response: any[]) => {
        console.log('Raw API Response:', response);
        this.isappliacntsloacded = true;

        this.applicants = response.map(applicant => ({
          // Spread the original applicant object first to preserve all original properties
          ...applicant,

          // Handle userImage specifically
          userImage: this.sanitizer.bypassSecurityTrustUrl(
            `data:image/png;base64,${applicant.user_image || ''}`
          ),

          // Ensure correct property names
          userId: applicant.user_id,
          userName: applicant.user_name,
          userEmail: applicant.user_email,

          // Round the total score
          total_score: this.roundScore(applicant.total_score),
        }));

        console.log('Processed Applicants:', this.applicants);
      },
      error:(error) => {
        console.error('Error fetching applicants:', error);
      }}
    );
  }

  getHighScoreApplicants(): Applicant[] {
    return this.applicants.filter(applicant =>
      applicant.total_score !== undefined && applicant.total_score > 15
    );
  }

  getLowScoreApplicants(): Applicant[] {
    return this.applicants.filter(applicant =>
      applicant.total_score !== undefined && applicant.total_score <= 15
    );
  }

  // Round score method with null/undefined handling
  roundScore(score?: number): number {
    // If score is undefined or null, return 0
    if (score == null) return 0;

    // Round to two decimal places
    return Math.round(score * 100) / 100;
  }


  updateshortlistmembers() {
    this.jobRecruiterService.getShortlistedCandidates(this.jobId).subscribe(
      {next:(response) => {
        this.shortlistedapplicants = response.shortlistedCandidates.map((applicant: Applicant) => {
          this.isshortlistedloaded = true;
          return {
            ...applicant,
            userImage: this.sanitizer.bypassSecurityTrustUrl(
              `data:image/png;base64,${applicant.userImage}`
            )
          };
        });
        console.log('Shortlisted candidates:', this.shortlistedapplicants);
        this.shortlistedIds1 = this.shortlistedapplicants.map(applicant => applicant.shortlistedCandidateId);
        console.log(this.shortlistedIds1, 'shortlistIds1'); // Output: [1, 2, 4]
      },
      error:(error) => {
        console.error('Error fetching shortlisted candidates:', error);
      }}
    );
  }

  getApplicantsCountByLevel(level: string): number {
    if (this.shortlistedapplicants && this.shortlistedapplicants.length > 0) {
      return this.shortlistedapplicants.filter((applicant: any) => applicant.applicantStatus === level).length;
    }
    return 0; // Return 0 if no applicants are found
  }
  


}
