import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobUserService, JobApplication } from '../../job-user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';  
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule,ToastModule,ButtonModule],
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.css'],
  providers: [MessageService]
})
export class MyApplicationsComponent {
  // Sample job applications data
  jobApplications: JobApplication[] = []; // Holds the job applications data
  userId!: number; // Will hold the user ID fetched from localStorage
  isloaded:boolean = false;
  recruiterId!: number;
  recommendations: any | null = null; // Holds the recommendations data


  constructor(private jobUserService: JobUserService, private sanitizer: DomSanitizer, private router:Router,private messageService: MessageService) {}

  ngOnInit(): void {
    // Fetch the userId from localStorage
    const storedUserId = localStorage.getItem('id'); // 'id' is the key name
    if (storedUserId) {
      this.userId = +storedUserId; // Convert to number
      this.fetchUserApplications();
    } else {
      console.error('User ID not found in localStorage.');
    }
  }

  viewJob(jobId: number): void {
    const activeTab = 'myApplications'; // Replace with dynamic logic if needed
    this.router.navigate(['/JobDetails', jobId, 'user'], { queryParams: { tab: activeTab } });
  }


  fetchUserApplications(): void {
    this.jobUserService.getUserApplications(this.userId).subscribe({
      next: (applications: JobApplication[]) => {
        console.log('Fetched job applications:', applications);
        this.jobApplications = applications;
        this.isloaded = true;
      },
      error: (error) => {
        console.error('Error fetching job applications:', error);
      }
    });
  }

  showModal: boolean = false; // Flag to control modal visibility
  selectedJob: JobApplication | null = null; // Currently selected job

  // Function to close feedback modal
  closeFeedbackModal(): void {
    this.showModal = false; // Hide the modal
    this.selectedJob = null; // Reset the selected job
  }


  sanitizeLogoUrl(logoUrl: string): SafeUrl {
    if (logoUrl.startsWith('data:')) {
      return this.sanitizer.bypassSecurityTrustUrl(logoUrl); // Already a valid data URI
    } else {
      // Assume it's base64 encoded and prefix it properly
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${logoUrl}`);
    }
  }

  //Timestamp
  formatPostedDate(dateString: string): string {
    if (!dateString) return 'Date unknown';

    // Parse the date string from format "YYYY-MM-DD HH:MM:SS"
    const jobDate = new Date(dateString);
    const now = new Date();

    // Calculate the difference in milliseconds
    const diffTime = now.getTime() - jobDate.getTime();

    // Calculate the difference in days, hours, and minutes
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays === 0 && diffHours === 0 && diffMinutes === 0) return 'Just now';
    if (diffDays === 0 && diffHours === 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    if (diffDays === 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'One day ago';
    if (diffDays === 2) return 'Two days ago';
    if (diffDays < 7) return `${diffDays} days ago`;

    const weeks = Math.floor(diffDays / 7);
    if (diffDays < 30) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;

    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} ago`;
}

  JobFeedbacks!:any[];
  showdata:boolean = false;

  getfeedbacks(Jobid:any,application:any){

    this.selectedJob = application;
    this.showModal = true; // Show the modal

    this.jobUserService.getuserfeedbacks(this.userId,Jobid).subscribe({
      next: (feedbacks: any[]) => {
        console.log('Fetched job feedbacks:', feedbacks);
        this.JobFeedbacks = feedbacks;
        this.showdata = true;
      },
      error: (error) => {
        console.error('Error fetching job applications:', error);
      }});


    this.selectedJob = application;
    this.recruiterId = application.recruiterId; // Not used for URL now
    this.showModal = true;

    const jobId = application.job?.id;
    if (jobId) {
      this.jobUserService
        .getRecommendations(this.userId, jobId) // Pass only userId and jobId
        .subscribe({
          next: (response: any) => {
            console.log('Recommendations fetched:', response);
            this.recommendations = response;

            // Process image sanitization
            this.recommendations.recommendations.recommended_courses.forEach((course: any) => {
              if (course.courseImage) {
                course.sanitizedImage = `data:image/png;base64,${course.courseImage}`;
              }
            });
          },
          error: (error) => {
            console.error('Error fetching recommendations:', error);
          },
        });
    }
  }
  isSectionOpen = {    recruiter: false,     user: false,   };   toggleSection(section: 'recruiter' | 'user') {     this.isSectionOpen[section] = !this.isSectionOpen[section]; }

  /////////////////////////////////////////////////////////
  // Method to withdraw an application
  withdrawApplication(applicationId: number): void {
    this.jobUserService.withdrawApplication(applicationId).subscribe({
      next: (response) => {
        console.log('Application withdrawn successfully:', response);
        // alert('Application withdrawn successfully!');\
        this.messageService.add({
 
          severity: 'success',
 
          summary: 'Success',
 
          detail: 'Application withdrawn successfully!'
 
        });

        this.jobApplications = this.jobApplications.map((application) =>
          application.id === applicationId
            ? { ...application, withdraw: 'yes'  }
            : application
        );
      },
      error: (error) => {
        console.error('Error withdrawing application:', error);
        this.messageService.add({
 
          severity: 'error',
 
          summary: 'Error',
 
          detail: 'Failed to withdraw the application. Please try again later.'
 
        });
 
      },
    });
  }

// Method to reapply for a job
reapplyApplication(applicationId: number): void {
  this.jobUserService.reapplyForJob(applicationId).subscribe({
    next: (response) => {
      console.log('Reapplication successful:', response, 'ApplicationId:', applicationId, 'userId:', this.userId);  
      this.messageService.add({
 
        severity: 'success',
 
        summary: 'Success',
 
        detail: 'Reapplication successful'
 
      });
 
      this.jobApplications = this.jobApplications.map((application) =>
        application.id === applicationId
          ? { ...application, withdraw: 'no' }
          : application
      );
    },
    error: (error) => {
      console.error('Error reapplying for the job:', error);
      this.messageService.add({
 
        severity: 'error',
 
        summary: 'Error',
 
        detail: 'Failed to reapply. Please try again later.'
 
      });
    },
  });
}


  toggleMenu(application: any): void {
    // Close all other dropdowns
    this.closeAllMenus();

    // Toggle the current dropdown
    application.menuOpen = !application.menuOpen;

    // Add or remove the document click listener
    if (application.menuOpen) {
      document.addEventListener('click', this.closeOnOutsideClick.bind(this, application));
    }
  }

  closeAllMenus(): void {
    this.jobApplications.forEach((app: any) => (app.menuOpen = false));
  }

  closeOnOutsideClick(application: any, event: MouseEvent): void {
    const target = event.target as HTMLElement;

    // Check if the click was outside the dropdown
    if (!target.closest('.menu-container')) {
      application.menuOpen = false; // Close the dropdown
      document.removeEventListener('click', this.closeOnOutsideClick.bind(this, application)); // Remove the listener
    }
  }


}  
