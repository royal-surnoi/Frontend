import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { JobUserService } from '../../job-user.service'; // Adjusted imports
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
 
export interface JobListings {
  id: number;
  jobTitle: string;
  jobDescription: string;
  jobType: string;
  location: string;
  minSalary: number | null;
  maxSalary: number | null;
  requiredSkills: string | null;
  appliedCount: number;
  createdAt: [];
  recruiter?: {
    id: number;
    recruiterName: string;
    recruiterEmail: string;
    recruiterRole: string | null;
  };
  jobAdmin?: {
    id: number;
    jobAdminName: string;
    jobAdminEmail: string;
    jobAdminCompanyName: string;
  };
}
 
@Component({
  selector: 'app-savedjobs',
  standalone: true,
  imports: [CommonModule, RouterLink,ToastModule,ButtonModule],
  templateUrl: './savedjobs.component.html',
  styleUrls: ['./savedjobs.component.css'],
  providers: [MessageService]
})
export class SavedjobsComponent implements OnInit, OnDestroy {
  jobListings: JobListings[] = [];
  filteredJobs: any[] = [];
  sortOrder: 'recent' | 'oldest' = 'recent';
  private interval: any;

  displayedSkills: string[] = [];
  showViewMoreButton: boolean = false;
  showAllSkills: boolean = false;
  allSkills: string[] = [];
  job: any;
  jobPosts: any;
 
  constructor(private jobService: JobUserService,private router:Router,private messageService: MessageService) {}
 
  ngOnInit() {
    this.getJobs();
   
  }
 
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
 
  getJobs() {
    const userId = parseInt(localStorage.getItem('id') || '43', 10); // Default to 43 for manual setting
 
    if (!userId) {
      console.error('User ID not found or invalid');
      return;
    }
 
    console.log('Fetching saved jobs for userId:', userId);
 
    this.jobService.getSavedJobsByUserId(userId).subscribe(
      {next:(jobs: any[]) => {
        console.log(jobs);
        this.jobListings = jobs.map(job => {
          const createdAt = job.job?.createdAt;        
 
          return {
            id: job.job.id,
            jobTitle: job.job.jobTitle || 'No title available',
            jobDescription: job.job.jobDescription || 'No description available',
            jobType: job.job.jobType || '',
            location: job.job.location || 'Unknown',
            minSalary: job.job.minSalary || 0,
            maxSalary: job.job.maxSalary || 0,
            requiredSkills:  job.job.requiredSkills,
            appliedCount: job.job.appliedCount || 0,
            createdAt: createdAt || 'Unknown',
            requiredWorkExperience:job.job.requiredWorkExperience,
            recruiter: job.recruiter
              ? {
                  id: job.recruiter.id,
                  recruiterName: job.recruiter.recruiterName || 'Unknown',
                  recruiterEmail: job.recruiter.recruiterEmail || 'No email provided',
                  recruiterRole: job.recruiter.recruiterRole ?? null,
                }
              : undefined,
            jobAdmin: job.job.jobAdmin || job.job.recruiter.jobAdmin,
            bgcolor:this.getCardColor()
          };
        });
        console.log(this.jobListings);
        this.filteredJobs = [...this.jobListings];
        console.log(this.jobListings);

       
      },
      error:(error) => {
        console.error('Error fetching saved jobs', error);
      }}
    );
  }
 
 
  formatPostedDate(createdAt: number[]): string {
    if (!createdAt || createdAt.length < 3) return 'Date unknown';
   
    const jobDate = new Date(createdAt[0], createdAt[1] - 1, createdAt[2]);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - jobDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
  
  unsave(job: any): void {
    const userId = localStorage.getItem('id');
    if (!userId) {
      console.error('User ID not found in local storage.');
      return;
    }
 
    this.jobService.unsaveJob(job.id, +userId).subscribe(
      {next:(response) => {
        console.log(response);

        this.messageService.add({
 
          severity: 'success',
 
          summary: 'Success',
 
          detail: `${job.jobTitle} has been unsaved.`
 
        });
        this.getJobs();
      },
      error:(error) => {
        console.error('Error unsaving job:', error);
        
        this.messageService.add({
 
          severity: 'error',
 
          summary: 'Error',
 
          detail: 'Failed to unsave the job. Please try again later.'
 
        });
      }}
    );
  }
 
  isExpanded: { [key: number]: boolean } = {}; // Track expanded state for each job

  toggleTitle(job: JobListings): void {
    this.isExpanded[job.id] = !this.isExpanded[job.id]; // Toggle expanded state for the clicked job
  }
 
  toggleSave(job: any): void {
    job.isSaved = !job.isSaved; // Toggle save/unsave state
    job.isDropdownVisible = job.isSaved; // Show dropdown only when saved
  }
 
   // Toggle visibility of all skills per job
   toggleSkills(job: any) {
    this.viewJob(job.id);
    job.showAllSkills = !job.showAllSkills;
  }
 
  // Display either 5 skills or all depending on toggle state
  getDisplayedSkills(job: any): string[] {
    // Ensure job.requiredSkills is not undefined or null
    const skills = job.requiredSkills ? job.requiredSkills.split(',') : [];
    return job.showAllSkills ? skills : skills.slice(0, 5);
  }

  viewJob(jobId: number): void {
    const activeTab = 'jobs';
    this.router.navigate(['/JobDetails', jobId, 'user'], { queryParams: { tab: activeTab } });
  }

  processSkills(skills: string) {
    const skillList = skills.split(',');
 
    // If there are more than 5 skills, limit them to 5 and show the "View More" button
    if (skillList.length > 5) {
      this.displayedSkills = skillList.slice(0, 5);
      this.showViewMoreButton = true;
    } else {
      this.displayedSkills = this.allSkills;
      this.showViewMoreButton = false;
    }
  }

  getCardColor(): string {
    const colors = [
      '#fef6e4', '#e8f5e9', '#e3f2fd', '#f3e5f5', '#fff3e0', // Light pastel colors
      '#fce4ec', '#e1bee7', '#c5cae9', '#b2dfdb', '#c8e6c9', // More light shades
      '#dcedc8', '#f1f8e9', '#f3f4f6', '#ffecb3', '#fbe9e7'  // Light neutral and warm shades
    ];
    const randomIndex = Math.floor(Math.random() * colors.length); // Randomly pick an index
    return colors[randomIndex];
  }


}
 
 