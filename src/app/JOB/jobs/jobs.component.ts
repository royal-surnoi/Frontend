import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { JobUserService } from '../../job-user.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AdminLoginDialogComponent } from '../../admin-login-dialog/admin-login-dialog.component';
import { RecruiterLoginDialogComponent } from '../../recruiter-login-dialog/recruiter-login-dialog.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

interface JobAdmin {
  id: number;
  jobAdminCompanyName: string;
}
 
interface JobListing {
  title: any;
  showAllSkills: any;
  id: number;
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string;
  location: string;
  minSalary: number;
  maxSalary: number;
  jobType: string;
  status: string;
  appliedCount: number;
  createdAt: number[];
  requiredWorkExperience: string;
  jobAdmin: JobAdmin;
  bgcolor:string;
}
 
type FilterType = 'experience' | 'location' | 'skills' | 'dateRange' | 'jobType';
type DateRangeType = 'all' | 'today' | 'week' | 'month';
 
@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastModule,ButtonModule,RouterLink],
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css'],
  providers: [MessageService]
})
export class JobsComponent {
 
  showRoleOptions = false; // To toggle role selection options
  selectedRole = '';
  isloaded: boolean = false;
  applicationsListAI: any[] = [];
 
  onRoleSelect() {
    this.showRoleOptions = true;
  }
 
  // navigateToRole() {
  //   if (!this.selectedRole) {
  //     alert('Please select a role.');
  //     return;
  //   }
 

  navigateToRole() {
    if (!this.selectedRole) {
      this.messageService.add({
 
        severity: 'error',
 
        summary: 'Error',
 
        detail: 'Please select a role!'
 
      });

      return;
    }
 
    if (this.selectedRole === 'admin') {
      if (!localStorage.getItem('adminId')) {
        this.openAdminLoginDialog();
      } else {
        this.router.navigate(['/JobAdmin']);
      }
    } else if (this.selectedRole === 'recruiter') {
      if (!localStorage.getItem('recruiterId')) {
        this.openRecruiterLoginDialog();
 
      } else {
        this.router.navigate(['/JobRecruiter']);
      }
    }
  }
 
  openAdminLoginDialog() {
    const dialogRef = this.dialog.open(AdminLoginDialogComponent, {
      width: '400px'
    });
 
    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        // Navigate to admin jobs page
        this.router.navigate(['/JobAdmin/addJob']);
      }
    });
  }
 
  openRecruiterLoginDialog() {
    this.dialog.open(RecruiterLoginDialogComponent, {
      width: '100%', // or specific width
      maxWidth: '100vw',
      height: '100%',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog'
    });
  }
 
  @Input() theme?: string;
 
  applicationsList: JobListing[] = [];
  filteredJobs: JobListing[] = [];
  locationSearch: string = '';
  experienceOptions: string[] = [];
  locationOptions: string[] = [];
  skillOptions: string[] = [];
  userId!: number;
  skillSearch: string = '';
 
  filters = {
    experience: new Set<string>(),
    location: new Set<string>(),
    skills: new Set<string>(),
    dateRange: 'all' as DateRangeType,
    jobType: new Set<string>,
  }
 
 
  // Pagination properties
  Math = Math;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  paginatedJobs: JobListing[] = [];
 
 
  // To limit displayed skills and manage 'view more' behavior
  displayedSkills: string[] = [];
  showViewMoreButton: boolean = false;
  showAllSkills: boolean = false;
  allSkills: string[] = [];
  job: any;
  jobPosts: any;
 
 
  constructor(private http: HttpClient, private jobService: JobUserService, private router: Router, private authService: AuthService, private dialog: MatDialog,private messageService: MessageService) { }
 
 
 
 
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
 
  // Modify the skills processing to handle limited display
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
 
  // toggleSkills() {
  //   // Toggle between showing all skills or just the first 5
  //   if (this.showAllSkills) {
  //     this.displayedSkills = this.allSkills.slice(0, 5);
  //   } else {
  //     this.displayedSkills = [...this.allSkills];
  //   }
  //   this.showAllSkills = !this.showAllSkills; // Toggle state
  // }
 
 
 
  ngOnInit() {
    this.getAllJobApplications();
    this.getAllJobApplicationsAI();
  }
 
  // Function to filter jobs by location based on the search input
  searchLocation() {
    const searchTerm = this.locationSearch.toLowerCase(); // Convert input to lowercase
    this.filteredJobs = this.applicationsList.filter(job => {
      if (job.location) {
        return job.location.toLowerCase().includes(searchTerm); // Case-insensitive match
      }
      return false;
    });
    this.currentPage = 1; // Reset pagination when filters change
    this.updatePaginatedJobs();
  }
 
 
 
 
  // Function to filter jobs by skills based on the search input
  searchSkills() {
    const searchTerm = this.skillSearch.toLowerCase(); // Convert input to lowercase
    this.filteredJobs = this.applicationsList.filter(job => {
      if (job.requiredSkills) {
        const skills = job.requiredSkills.split(',').map(skill => skill.toLowerCase()); // Convert skills to lowercase
        return skills.some(skill => skill.includes(searchTerm)); // Partial match
      }
      return false;
    });
    this.currentPage = 1; // Reset pagination when filters change
    this.updatePaginatedJobs();
  }
 
 
  initializeFilterOptions() {
    // Initialize the filter options for experience, location, and skills
 
    this.experienceOptions = [
      ...new Set(
        this.applicationsList.map((job) => job.requiredWorkExperience).filter((exp): exp is string => exp !== null)
      ),
    ];
 
    this.locationOptions = [
      ...new Set(
        this.applicationsList.map((job) => job.location).filter((loc): loc is string => loc !== null)
      ),
    ];
 
    this.skillOptions = [
      ...new Set(
        this.applicationsList.flatMap((job) =>
          job.requiredSkills ? job.requiredSkills.split(',') : []
        )
      ),
    ];
  }
 
  formatPostedDate(createdAt: number[]): string {
    if (!createdAt || createdAt.length < 3) return 'Date unknown';
   
    // Create a Date object for the job date, setting hours, minutes, and seconds to 0 to handle full day comparison
    const jobDate = new Date(createdAt[0], createdAt[1] - 1, createdAt[2]);
   
    // Get the current date and reset hours, minutes, and seconds to 0
    const now = new Date();
    now.setHours(0, 0, 0, 0);  // Set current date to midnight to compare days only
   
    // Calculate the difference in time between today and the job posting date
    const diffTime = now.getTime() - jobDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }
   
 
  updateFilters(filterType: FilterType, value: string, event?: Event) {
    // Handle 'dateRange' separately
    if (filterType === 'dateRange') {
      this.filters.dateRange = value as DateRangeType;
    } 
    // Handle the case when it's a <select> dropdown like 'jobType'
    else if (filterType === 'jobType') {
      this.filters.jobType = new Set<string>(); // Ensure it's a set
      if (value) {
        this.filters.jobType.add(value);
      }
    } 
    // Handle checkboxes (experience, location, skills)
    else if (event) {
      const isChecked = (event.target as HTMLInputElement).checked;
      if (!this.filters[filterType]) {
        this.filters[filterType] = new Set<string>();
      }
  
      if (isChecked) {
        this.filters[filterType].add(value);
      } else {
        this.filters[filterType].delete(value);
      }
    }
    
    // Apply the updated filters
    this.applyFilters();
  }
  

  
 
 
 
  isWithinDateRange(createdAt: number[]): boolean {
    if (!createdAt || createdAt.length < 3) return false;
 
    const jobDate = new Date(createdAt[0], createdAt[1] - 1, createdAt[2]);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - jobDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
 
    switch (this.filters.dateRange) {
      case 'today':
        return diffDays === 0;
      case 'week':
        return diffDays <= 7;
      case 'month':
        return diffDays <= 30;
      default:
        return true;
    }
  }
 
  applyFilters() {
    this.filteredJobs = this.applicationsList.filter((job) => {
      const experienceMatch =
        this.filters.experience.size === 0 ||
        (job.requiredWorkExperience && this.filters.experience.has(job.requiredWorkExperience));
  
      const locationMatch = this.filters.location.size === 0 || this.filters.location.has(job.location);
  
      const skillsMatch =
        this.filters.skills.size === 0 ||
        (job.requiredSkills && job.requiredSkills.split(',').some((skill) => this.filters.skills.has(this.skillSearch.toLowerCase())));
  
      const jobTypeMatch = 
        this.filters.jobType.size === 0 || 
        (job.jobType && this.filters.jobType.has(job.jobType));
  
      const dateMatch = this.isWithinDateRange(job.createdAt);
  
      return experienceMatch && locationMatch && skillsMatch && jobTypeMatch && dateMatch;
    });
 
 
    // Reset to first page after applying filters
 
    this.currentPage = 1;
 
    // Pagination check to ensure we don't exceed total pages
    if (this.currentPage > Math.ceil(this.filteredJobs.length / this.itemsPerPage)) {
      this.currentPage = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    }
 
    this.updatePaginatedJobs(); // Update the paginated jobs
  }
 
  updatePaginatedJobs() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedJobs = this.filteredJobs.slice(startIndex, endIndex);
  }
 
  changePage(page: number): void {
    this.currentPage = page;
    this.updatePaginatedJobs(); // Update job listings for the selected page
  }
 
  getAllJobApplications() {
    this.http.get<JobListing[]>(`${environment.apiBaseUrl}/api/jobs/activeJobs`).subscribe((res) => {
      const resp = res.reverse();
      this.applicationsList = resp;
      this.filteredJobs = res;
      this.isloaded = true
 
      // Ensure to process skills after fetching data
      res.forEach((job) => {this.processSkills(job.requiredSkills);
        job.bgcolor = this.getCardColor();
      });
 
      this.initializeFilterOptions();
      this.updatePaginatedJobs();
    });
  }
 
  saveJob(jobId: number): void {
    this.userId = Number(localStorage.getItem('id'));
    if (this.userId !== null && jobId !== null) {
      this.jobService.saveJob(this.userId, jobId).subscribe(
        {next:(response: any) => {
          console.log('Job saved successfully:', response);
          this.messageService.add({
 
            severity: 'success',
 
            summary: 'Success',
 
            detail: 'Job saved successfully!'
 
          });
        },
        error:(error: HttpErrorResponse) => {
          console.error('Error saving job:', error.message);
          this.messageService.add({
 
            severity: 'error',
     
            summary: 'Error',
     
            detail: 'Error saving job: ' + error.message
          
          });
        }}
      );
    } else {
      console.error('Missing userId or jobId');
      this.messageService.add({
 
        severity: 'error',
 
        summary: 'Error',
 
        detail: 'Missing userId or jobId'
 
      });
     }
  }
 
 
  viewJob(jobId: number): void {
    const activeTab = 'jobs';
    this.router.navigate(['/JobDetails', jobId, 'user'], { queryParams: { tab: activeTab } });
  }
  // ------------p----------------
 
  getAllJobApplicationsAI() {
    this.userId = Number(localStorage.getItem('id'));
 
 
    console.log("Working", this.userId)
    this.http.get<any>(`${environment.apiBaseUrlAI}/job_recommendations/${this.userId}`).subscribe((res) => {
      console.log(res.jobs);
 
      
      this.applicationsListAI = res.jobs;
      
      this.applicationsListAI.forEach((job) => {this.processSkills(job.requiredSkills);
        job.bgcolor = this.getCardColor();
      });
      
      console.log("getAllJobApplicationsAI is working...");
 
 
    });
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
 
 
 
 
 
 