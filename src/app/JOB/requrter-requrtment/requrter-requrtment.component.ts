import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobRecruiterService ,JobAdmin} from '../../job-recruiter.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
 
interface JobListing {
  id: number;
  title: string;
  company: string;
  No_Applicants: number;
  experience: string;
  salary: string;
  location: string;
  description: string;
  skills: string[];
  postedDate: string;
  postedTimestamp: number;
  relativeTime: string;
  requiredEducation: string;
  requiredEducationStream: string;
  requiredPercentage: string;
  requiredPassoutYear: string;
  requiredWorkExperience: any;
  minSalary?: number;
  maxSalary?: number;
  vacancyCount?: number;
 
}
 
export interface JobWithCreatedAt {
  id: number;
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string;
  location: string;
  minSalary?: number;
  maxSalary?: number;
  jobType?: string;
  status?: string;
  vacancyCount?: number;
  appliedCount?: number;
  recruiter?: {
    jobAdmin?: {
      jobAdminCompanyName: string;
    };
  };
  postedTimestamp: number;
  createdAt: number[];  // If this array holds date values
  requiredEducation: string;
  requiredEducationStream: string;
  requiredPercentage: string;
  requiredPassoutYear: string;
  requiredWorkExperience: string;
}
 
@Component({
  selector: 'app-requrter-requrtment',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './requrter-requrtment.component.html',
  styleUrls: ['./requrter-requrtment.component.css']
})
export class RequrterRequrtmentComponent implements OnInit, OnDestroy {
  jobListings: JobListing[] = [];
  filteredJobs: JobListing[] = [];
  experienceOptions: string[] = [];
  locationOptions: string[] = [];
  skillOptions: string[] = [];
  sortOrder: 'recent' | 'oldest' = 'recent';
  isEditFormVisible = false;
  jobToEdit: any;
  jobForm!: FormGroup;
 
  filters = {
    experience: new Set<string>(),
    location: new Set<string>(),
    skills: new Set<string>()
  };
 
  private interval: any; // To hold the setInterval reference for cleanup
 
  constructor(private fb: FormBuilder,private jobService: JobRecruiterService) {
    this.jobForm = this.fb.group({
      id: [0, Validators.required],
      jobTitle: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      jobDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(2000)]],
      requiredSkills: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
      location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      minSalary: [0, [Validators.required, Validators.min(0), Validators.max(10000000)]],
      maxSalary: [0, [Validators.required, Validators.min(0), Validators.max(10000000)]],
      jobType: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      vacancyCount: [1, [Validators.required, Validators.min(1), Validators.max(10000000)]],
      requiredEducation: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      requiredEducationStream: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      requiredPercentage: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      requiredPassoutYear: ['', [Validators.required, Validators.pattern('^\\d{4}$')]],
      requiredWorkExperience: [0, [Validators.required, Validators.min(0)]]
    });
  }
  recruiterId:number=0;
  ngOnInit() {
    this.getJobs();
    this.recruiterId = parseInt(localStorage.getItem('recruiterId') || '0', 10);
    this. fetchAdminData(this.recruiterId);
  }
 
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval); // Clean up interval when component is destroyed
    }
  }
 

  getJobs() {
    console.log("Fetching jobs...");
  
    const recruiterId = parseInt(localStorage.getItem('recruiterId') || '0', 10);
  
    if (!recruiterId) {
      console.error('Recruiter ID not found or invalid');
      return;
    }
  
    this.jobService.getActiveJobsByRecruiterId(recruiterId).subscribe(
      {next:(jobs: any[]) => {
        this.jobListings = jobs.map(job => ({
          id: job.id,
          title: job.jobTitle,
          company: job.recruiter?.jobAdmin?.jobAdminCompanyName || 'Unknown',
          No_Applicants: 0, // Initialize to 0
          experience: job.jobType || '',
          salary: `${job.minSalary ?? 0} - ${job.maxSalary ?? 0}`,
          location: job.location,
          description: job.jobDescription,
          skills: job.requiredSkills.split(','),
          postedDate: this.formatDateFromTimestamp(job.createdAt),
          postedTimestamp: job.createdAt,
          relativeTime: this.getRelativeTime(job.createdAt),
          requiredEducation: job.requiredEducation,
          requiredEducationStream: job.requiredEducationStream,
          requiredPercentage: job.requiredPercentage,
          requiredPassoutYear: job.requiredPassoutYear,
          requiredWorkExperience: job.requiredWorkExperience,
          minSalary: job.minSalary,
          maxSalary: job.maxSalary,
          vacancyCount: job.vacancyCount
        }));
  
        this.filteredJobs = [...this.jobListings];
  
        // Fetch applicant count for each job
        this.jobListings.forEach(job => {
          this.jobService.getApplicationsWithEducationByJobId(job.id).subscribe(
            {next:(response: any) => {
              job.No_Applicants = response.applicants.length; // Update with the count of applicants
            },
            error:(error) => {
              console.error(`Error fetching applicants for job ${job.id}:`, error);
            }}
          );
        });
  
        console.log("Jobs fetched successfully:", this.filteredJobs);
        this.initializeFilterOptions();
      },
      error:(error) => {
        console.error("Error fetching jobs:", error);
      }}
    );
  }
  
 
  // Function to calculate "time ago" string
  getRelativeTime(timestamp: any): string {
    const date = new Date(
      timestamp[0],
      timestamp[1] - 1,
      timestamp[2],
      timestamp[3],
      timestamp[4],
      timestamp[5]
    );
 
    const now = new Date();
    const timeDifference = now.getTime() - date.getTime();
 
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);
 
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`;
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
 
  // Function to set interval to update relative times every minute
  startRelativeTimeUpdate() {
    this.interval = setInterval(() => {
      this.jobListings.forEach(job => {
        job.relativeTime = this.getRelativeTime(job.postedTimestamp);  // Update relative time
      });
    }, 60000);  // Updates every minute
  }
 
  formatDateFromTimestamp(timestamp: number[]): string {
    const date = new Date(timestamp[0], timestamp[1] - 1, timestamp[2], timestamp[3], timestamp[4], timestamp[5]);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }
 
  initializeFilterOptions() {
    this.experienceOptions = [...new Set(this.jobListings.map(job => job.experience))];
    this.locationOptions = [...new Set(this.jobListings.map(job => job.location))];
    this.skillOptions = [...new Set(this.jobListings.flatMap(job => job.skills))];
  }
 
  updateFilters(filterType: 'experience' | 'location' | 'skills', value: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.filters[filterType].add(value);
    } else {
      this.filters[filterType].delete(value);
    }
    this.applyFilters();
  }
 
  applyFilters() {
    this.filteredJobs = this.jobListings.filter(job => {
      const experienceMatch = this.filters.experience.size === 0 || this.filters.experience.has(job.experience);
      const locationMatch = this.filters.location.size === 0 || this.filters.location.has(job.location);
      const skillsMatch = this.filters.skills.size === 0 || job.skills.some(skill => this.filters.skills.has(skill));
      return experienceMatch && locationMatch && skillsMatch;
    });
    this.sortJobs();
  }
 
  onSortChange(event: Event) {
    this.sortOrder = (event.target as HTMLSelectElement).value as 'recent' | 'oldest';
    this.sortJobs();
  }
 
  sortJobs() {
    this.filteredJobs.sort((a, b) => {
      if (this.sortOrder === 'recent') {
        return b.postedTimestamp - a.postedTimestamp;
      } else {
        return a.postedTimestamp - b.postedTimestamp;
      }
    });
  }
 
  openEditForm(job: any) {
    this.isEditFormVisible = true;
    this.jobToEdit = job;
    this.jobForm.patchValue({
      id:job.id,
      jobTitle: job.title,
      jobDescription: job.description,
      requiredSkills: job.skills ? job.skills.join(', ') : '', // If skills is an array, convert it to a comma-separated string
      location: job.location,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      jobType: job.experience,
      vacancyCount: job.vacancyCount,
      requiredEducation: job.requiredEducation,
      requiredEducationStream: job.requiredEducationStream,
      requiredPercentage: job.requiredPercentage,
      requiredPassoutYear: job.requiredPassoutYear,
      requiredWorkExperience: job.requiredWorkExperience
    });
  }
 
 
  closeEditForm() {
    this.isEditFormVisible = false;
    this.jobToEdit = null;
  }
 
  formSubmitted = true;  // This flag will track if the form is submitted
 
 
  onEditSubmit() {
 
    this.formSubmitted = true; // Mark the form as submitted
 
      console.log('Submit triggered'); // Check if the method is being called
 
    if (this.jobForm.invalid) {
      console.log('Form is invalid');
      alert("Please fill in all the required fields.");
      return; // Exit the function without proceeding
    }
 
    if (this.jobAdmin?.id && this.recruiterId) {
      const updatedJob = { ...this.jobForm.value };
      console.log('Updating job:', updatedJob);
 
      this.jobService.updateJobByRecruiter(updatedJob.id, this.recruiterId, updatedJob).subscribe({
        next: (data) => {
          console.log('Update response:', data);
          alert("Job updated successfully!");
          this.closeEditForm();
        },
        error: (error) => {
          console.error('Update error:', error);
          alert("Something went wrong while updating the job.");
        }
      });
    } else {
      console.log('Invalid jobAdmin or recruiterId');
    }
  }
 
 
   
  fetchAdminData(recruiterId: number): void {
    this.jobService.getAdminByRecruiterId(recruiterId).subscribe(
      {next:(data: JobAdmin) => {
        this.jobAdmin = data;
      },
      error:(error) => {
        console.error('Error:', error);
      }}
    );
  }
 
 
jobAdmin?: JobAdmin;
 
holdjob(jobId: number, recruiterId: number): void {
  const status = 'inactive'; // Or dynamically set the desired status

  this.jobService.updateJobhold(jobId, recruiterId, status)
    .subscribe(
      {next:(response) => {
        console.log('Job deleted successfully:', response);
        alert('Job status updated successfully!'); // Display success alert
        window.location.reload(); // Reload the window
      },
      error:(error) => {
        console.error('Error deleting job:', error);
        alert('Failed to delete the job. Please try again later.'); // Display error alert
      }}
    );
}

 
 
 
 
}
 
 
 
 
 
 
 