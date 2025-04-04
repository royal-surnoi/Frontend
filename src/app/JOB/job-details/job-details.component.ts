import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, RouterLink ,Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JobUserService, JobDetails } from '../../job-user.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SafeHtml, SafeUrl } from '@angular/platform-browser'
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
 
interface JobStatus {
  isOpen: boolean;
  isApplied: boolean;
}
 
 
 
@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink,ToastModule,ButtonModule],
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css'],
  providers: [MessageService]
})
 
 
export class JobDetailsComponent {
  jobId: number = 0;
  jobdetails!: JobDetails;
  companyLogo: SafeUrl = '';
  isModalOpen = false;
  selectedFile: File | null = null;
  activeSection: string = 'About Job';
  showMore: boolean = false;
 seemore:boolean = false;
  // ViewChild to reference the file input element
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  // jobdetails!: JobDetails ;
 
  constructor(private route: ActivatedRoute, private jobUserservice : JobUserService, private http : HttpClient, private router : Router,private messageService: MessageService) {}
 
  userid : number = 0;
  jobStatus: JobStatus | null = null;
  isUserApplied : boolean = false;
  IsJobActive : boolean = true;
  applydisable:boolean = false;
  ApplyButtonShow: boolean = true;
  Type:string =  'user';
 
 
 
  ngOnInit(): void {
    this.generateGradient();
    this.route.params.subscribe((params) => {
      this.scrollToTop()
      this.userid = Number(localStorage.getItem('id'))
      this.jobId = +params['Jobid']; // Ensure jobId is a number
      this.loaddata();
      this.checkdata();
      this.ApplyButtonShow =  params['type']=='user'?true:false;
      this.Type = params['type'];
      // console.log(params['type']+"--->"+this.ApplyButtonShow )
    });
    this.fetchJobs();
 
  }
 
  checkdata(){
    this.http.get<JobStatus>(`http://localhost:8080/api/applications/isApplied/${this.jobId}/${this.userid}`).subscribe({
      next: (status) => {
        console.log(status)
        this.jobStatus = status;
        this.isUserApplied = status.isApplied;
        this.IsJobActive = status.isOpen;
      },
      error: (err) => {
        console.error('Failed to fetch job status:', err);
      },
    });
  }
 
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
 
  jobDescription!:SafeHtml;
 
 
  loaddata(){
    this.jobUserservice.getJobDetails((this.jobId)).subscribe({
      next: (data) => {
        console.log(data);
        this.jobdetails = data;
         if (data.jobAdmin.companyLogo) {
          this.companyLogo = (
            `data:image/png;base64,${data.jobAdmin.companyLogo}`
          );
          this.jobDescription = (this.jobdetails.jobDescription);
        }
      },
      error: (error) => {
       console.log(error);
      }
    });
  }
 
  // Toggle Modal
  openModal(): void {
    this.isModalOpen = true;
    this.loadResume();
  }
 
  file: File | null = null;
  fileName : string = 'Resume Not Avilable';
  fileUrl: string | null = null;
 
loadResume() {
  const currentUserId = Number(localStorage.getItem('id'))
  this.http.get(
    `http://localhost:8080/personalDetails/${currentUserId}/getResume`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
    }
  ).subscribe({
    next: (blob: Blob) => {
      if (blob.size > 0) {
        // Determine file extension based on MIME type
        let fileExtension = '';
        switch (blob.type) {
          case 'application/pdf':
            fileExtension = 'pdf';
            break;
          case 'application/msword':
            fileExtension = 'doc';
            break;
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            fileExtension = 'docx';
            break;
          default:
            console.warn('Unknown file type');
        }
 
        // Construct a file name with the determined extension
        this.fileName = `resume.${fileExtension}`;
       
        // Convert Blob to File object and store in 'file' variable
        this.file = new File([blob], this.fileName, { type: blob.type, lastModified: Date.now() });
 
        // Create URL for download link
        this.fileUrl = URL.createObjectURL(this.file);
 
        console.log('File loaded successfully:', this.file);
      } else {
        console.error('Received an empty file');
        this.file = null;
      }
    },
    error: (error: HttpErrorResponse) => {
      console.error('Failed to load file:', error.message);
      this.file = null;
    }
  });
}
 
 
addexistingResume(){
  if(this.file){
    this.selectedFile = this.file;
    this.fileUrl = URL.createObjectURL(this.file);
    console.log('File selected:', this.fileName);
  }
}
 
cancelResume(){
  this.selectedFile = null;
}
 
 
 
 
  closeModal(): void {
    this.isModalOpen = false;
  }
 
  // Trigger File Input on Click
  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }
 
  // Handle File Selection
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
  
      // Check file type (must be PDF) and size (must be less than 1MB)
      if (file.type === 'application/pdf' && file.size <=  5 * 1024 * 1024) {
        this.selectedFile = file;
        this.fileUrl = URL.createObjectURL(this.selectedFile);
        console.log('File selected:', this.selectedFile.name);
      } else {
        console.error('Invalid file. Only PDFs under 1MB are allowed.');
        alert('Invalid file. Please upload a PDF file under 5MB.');
        input.value = ''; // Clear input if the file is invalid
      }
    }
  }
  
 
  // Drag and Drop Logic
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const uploadBox = event.currentTarget as HTMLElement;
    uploadBox.classList.add('dragging');
  }
 
  onDragLeave(event: DragEvent): void {
    const uploadBox = event.currentTarget as HTMLElement;
    uploadBox.classList.remove('dragging');
  }
 
  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const uploadBox = event.currentTarget as HTMLElement;
    uploadBox.classList.remove('dragging');
  
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
  
      // Check file type (must be PDF) and size (must be less than 1MB)
      if (file.type === 'application/pdf' && file.size <= 1048576) {
        this.selectedFile = file;
        console.log('File dropped:', this.selectedFile.name);
      } else {
        console.error('Invalid file. Only PDFs under 1MB are allowed.');
        alert('Invalid file. Please upload a PDF file under 1MB.');
      }
    } else {
      console.error('No file was dropped or invalid input.');
    }
  }
  
 
  // Submit Application
  submitApplication(): void {
    if(!this.applydisable){
    this.applydisable = true;
    if (this.selectedFile) {
      this.jobUserservice.applyJob(this.jobId,this.userid,this.selectedFile).subscribe({
        next: (resp) => {
          console.log(resp);
         
          this.messageService.add({
 
            severity: 'success',
 
            summary: 'Success',
 
            detail: 'Application submitted successfully!'
 
          });
          this.isModalOpen=false;
          this.router.navigate(['/Job']);
 
      },
      error: (error) => {
        console.log(error);
        
        this.messageService.add({
 
          severity: 'error',
 
          summary: 'Error',
 
          detail: 'Something Went Wrong!!!'
 
        });
 
      }
    });
     
    } else {
       
       this.messageService.add({
 
        severity: 'error',
 
        summary: 'Error',
 
        detail: 'Please select a resume to upload.'
 
      });    }
  }
  }
 
  // Toggle Content Logic
  toggleContent(): void {
    this.showMore = !this.showMore;
  }
 
 
  // Jobs List
  jobs: any[] = [];
  isFetchingJobs = true; // Specific variable for fetching jobs
  isNavigating = false; // Loading state for navigation
 
  fetchJobs(): void {
    this.isFetchingJobs = true; // Start fetching jobs
    this.http
      .get<any[]>(`http://localhost:8000/job-job-recommendations/${this.jobId}`)
      .subscribe(
        {next: (data) => {
          this.jobs = data.map((job) => ({
            id: job.id,
            title: job.jobTitle,
            companyName: job.jobAdmin?.jobAdminCompanyName || 'Unknown Company',
            location: job.location,
            alumniCount: 0, // Set a default value if alumniCount is not provided
            daysAgo: this.calculateDaysAgo(job.createdAt),
          }));
          this.isFetchingJobs = false; // End fetching jobs
        },
        error :(error) => {
          console.error('Error fetching jobs:', error);
          this.isFetchingJobs = false; // End fetching jobs on error
        }
      });
  }
 
  calculateDaysAgo(createdAt: number[]): number {
    const createdDate = new Date(createdAt[0], createdAt[1] - 1, createdAt[2]);
    const today = new Date();
    const diff = Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff;
  }
 
  navigateToJobDetails(jobId: number): void {
    this.isNavigating = true; // Start navigation loading state
    setTimeout(() => {
      // Simulating a delay for demonstration; replace with actual API call if needed
      this.router.navigate(['/JobDetails', jobId, this.Type]).then(() => {
        this.isNavigating = false; // End navigation loading state
      });
    }, 1000); // Adjust delay as needed
  }
  people = [
    { profilePic: '../../assets/profile.jpg' },
    { profilePic: 'assets/profile-placeholder.png' },
    { profilePic: 'assets/profile-placeholder.png' },
  ];
 
  goBack() {
    const tab = this.route.snapshot.queryParamMap.get('tab') || 'jobs';
    console.log('Navigating back to tab:', tab);
    this.router.navigate(['/Job'], { queryParams: { tab } });
  }
 
 
  // Method to get experience level as a string based on numeric value
  getExperienceLevel(level: number | null | undefined): string {
    if (level!=null || level!=undefined){
    if (level <= 1) {
      return 'Fresher';
    } else if (level <= 3) {
      return 'Junior';
    } else if (level <= 5) {
      return 'Mid-Senior';
    } else {
      return 'Senior';
    }
  }
  else{
    return ''
  }
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
 

changeActiveSection(section: string): void {
  this.activeSection = section;
}

formatDate(dateArray: number[]): string {
  const date = new Date(dateArray[0], dateArray[1] - 1, dateArray[2], dateArray[3], dateArray[4], dateArray[5]);
  const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
  };
  return `Posted on ${date.toLocaleDateString('en-US', options)}`;
}

sendEmail(job:any): void {
  const email = job.recruiter?.recruiterEmail?job.recruiter.recruiterEmail:job.jobAdmin.jobAdminEmail; // Replace with your email
  const subject = `Request for More Information About ${job.jobTitle} at ${job.jobAdmin.jobAdminCompanyName} in ${job.location} ${this.formatDate(job.createdAt)}`;
  const body = `Dear ${job.recruiter?.recruiterName?job.recruiter.recruiterName:job.jobAdmin.jobAdminName},

I hope this email finds you well.

I recently came across the ${job.jobTitle} position at  ${job.jobAdmin.jobAdminCompanyName} located in ${job.location}, and I am highly interested in learning more about this opportunity. The role aligns perfectly with my skills and career goals, and I am eager to understand the specific responsibilities, qualifications, and expectations for this position.

Could you kindly provide more details about:
- The key responsibilities of the role.
- Any specific qualifications or certifications required.
- The application process and timeline.

Additionally, if there are other documents or information you need from me, please let me know. I would be happy to share my updated resume or any relevant details.

Thank you for your time and assistance. I look forward to your response.

Best regards, `;

  // Construct the mailto link
 
  const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;


  // Open the mail client
  window.location.href = gmailLink;
}

gradientStyle: string = '';

  // Fixed color palette
  colors: string[] = [
    '#362046', '#7A789F', '#301B3E', '#000000', '#3D2250', 
    '#8B89B5', '#281632', '#6F6E93', '#452758', '#000000', 
    '#342045', '#8584AA', '#2F1B3D', '#7D7BA1', '#3A214D', 
    '#000000', '#2A1735', '#716F95'
  ];

 

  getRandomColor(): string {
    return this.colors[Math.floor(Math.random() * this.colors.length)];
  }

  generateGradient(): void {
    let color1 = this.getRandomColor();
    let color2 = this.getRandomColor();
    let color3 = this.getRandomColor();

    this.gradientStyle = `linear-gradient(135deg, ${color1}, ${color2}, ${color3})`;
  }

  openAiResume(){
    console.log("jobId",this.jobId);
    this.router.navigate(['/airesume'],{ queryParams: { jobId: this.jobId } });
  }
 
 
}