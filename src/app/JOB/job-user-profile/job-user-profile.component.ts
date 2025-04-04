import { Component, ElementRef, HostListener,SecurityContext, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,} from '@angular/router';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { EducationDetail, Experience, JobUserService, UserProjects, UserSkills } from '../../job-user.service';
import { DomSanitizer, SafeResourceUrl,SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../auth.service';
import { catchError,retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse,HttpHeaders } from '@angular/common/http';
interface User {
  id: number;
  userDescription: string;
  profession: string;
  permanentCity: string;
  permanentState: string;
  permanentCountry: string;
  phoneNumber: string;
  theme: string;
  bannerImage?: string | SafeUrl;
  resume: string | null;
  user: {
    name: string;
    email: string;
    userImage?: string | SafeUrl;
  };
}

interface VideoUpload {
  id: string;
  title: string;
  file: File | null;
  progress: number;
  uploading: boolean;
  error: string | null;
  preview: string | null;
}
 
interface SelfIntroductionVideo {
  id: string;
  title: string;
  file: File | null;
  preview: string | null;
  progress: number;
  error: string | null;
  url?: string | null;
}
 
 
interface SelfIntroductionVideos {
  videos: SelfIntroductionVideo[];
}

interface Video {
  id: string;
  title: string;
  url: string | null;
}
 
export class VideoUploadComponent {
  videos: SelfIntroductionVideo[] = [];
  overallError: string | null = null;
  uploading: boolean = false;
}
 

interface ExtendedEducationDetail extends EducationDetail {
  id: number;  // Ensure there's an 'id' property for each education entry
  isEditingSchool?: boolean;
  isEditingIntermediate?: boolean;
  isEditingDiploma?: boolean;
  isEditingGraduation?: boolean;
  isEditingPostGraduate?: boolean;
}
 

// Interfaces for Skill and Project
interface Skill {
  id:number
  skillName: string;
  level: string;
  isEditing?: boolean;
}

interface Project {
  projectTitle: string;
  client: string;
  startDate: string;
  endDate: string;
  details: string;
  skillsUsed: string;
  videoUrl: string | ArrayBuffer | null;
  backgroundImage: string | ArrayBuffer | null;
 
}




@Component({
  selector: 'app-job-user-profile',
  standalone: true,
  imports: [PersonalInfoComponent, CommonModule,],
  templateUrl: './job-user-profile.component.html',
  styleUrl: './job-user-profile.component.css'
})
export class JobUserProfileComponent {
  userId: number = 0;
  ShowOverlay: boolean = false;
  isUploadingResume: boolean = false;
  uploadError: string | null = null;
  safeResumeUrl: SafeResourceUrl | null = null;
  private blobUrl: string | null = null;

  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedFileTypes = ['.pdf', '.doc', '.docx'];
 
  private readonly VideomaxFileSize = 100 * 1024 * 1024; // 100MB
  videosExist: boolean = false;


  videos: SelfIntroductionVideo[] = [
    { id: 'personalVideo', title: 'Personal Introduction', file: null, progress: 0, error: null, preview: null, url: null },
    { id: 'educationVideo', title: 'Education Background', file: null, progress: 0,  error: null, preview: null, url: null },
    { id: 'workExperienceVideo', title: 'Work Experience', file: null, progress: 0, error: null, preview: null, url: null },
    { id: 'achievementsVideo', title: 'Achievements', file: null, progress: 0,  error: null, preview: null, url: null }
  ];
 
  private readonly maxvideoFileSize = 100 * 1024 * 1024; // 100MB
  private readonly allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  uploading = false;
  overallError: string | null = null;

  constructor(private JobUserService: JobUserService, private sanitizer: DomSanitizer,private http : HttpClient, private authService: AuthService, private route:ActivatedRoute
  ) { }

   ngOnInit() {
    this.route.params.subscribe((params) => {
      this.setGreetingMessage();
      this.scrollToTop()
      this.userId = +params['userId']; // Ensure jobId is a number
      this.loadResume();
      this.loadVideos();
      this.gettingCombinedVideo();
      this.loadUserProfile();
    
      this.loadExperiences(this.userId);
      this.loadEducation(this.userId);

      this.getSkills();
      this.fetchProjects();
    });
  }

  
  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.checkVideoVisibility(); // Initial check when component loads
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkVideoVisibility();
  }

  private checkVideoVisibility(): void {
    if(this.videoContainer.nativeElement.getBoundingClientRect()){
    const rect = this.videoContainer.nativeElement.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (isVisible) {
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoPlayer.nativeElement.pause();
    }
  }
  }


 

  ngOnDestroy() {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }

    this.videos.forEach(video => {
      if (video.preview && !video.url) {
        URL.revokeObjectURL(video.preview);
      }
    });
  }
 

  // userId : number = 0;
  loadUserProfile() {
   
    console.log(this.userId)

    this.JobUserService.getUserProfile(Number(this.userId)).subscribe({
      next: (profile) => {
        this.user = profile;
        if (profile.user.userImage) {
          this.user.user.userImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${profile.user.userImage}`);
          this.user.theme = this.user.theme.toLowerCase();
          this.currentTheme = this.user.theme;
          this.previewTheme = this.user.theme;
          if(profile.bannerImage){
            this.user.bannerImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${profile.bannerImage}`);
            console.log(this.user.bannerImage);
          }
        }
        this.isloaded = true;
        // console.log(this.user.user.userImage)
      },
      error: (error) => {
        console.log(error.message);
        if (error.status === 404) { 
          this.ShowPopup = true; // Set popup variable to true on 404 error
          // this.scrollPosition = window.scrollY; // Save current scroll position
          // document.body.style.position = 'fixed';
          // document.body.style.top = `-${this.scrollPosition}px`;
          // document.body.style.width = '100%';
        }
      }
    });
  }


  getBannerImageUrl(): string {
    if (this.user && this.user.bannerImage) {
      // console.log(this.user.bannerImage.toString().replace("SafeValue must use [property]=binding: ", ""))
      const newlink = `url('${this.user.bannerImage.toString().replace("SafeValue must use [property]=binding: ", "").replace(" (see https://g.co/ng/security","")}')`;
      return newlink;
    }
    return "";
  }

  

  user!: User;
  shoqgallarydata: boolean = false;
  activeTab: string = 'skillsProjects'; // Default active tab   
  Add: any;
  showEditCaution: boolean = false;
  showEditOptions = false;
  currentTheme: string = "";
  previewTheme: string = "";
  ShowPopup: boolean = false
  isloaded: boolean = false;
  experiences: Experience[] = [];
  educationDetails: ExtendedEducationDetail[] = [];
    



  // showgallary() {
  //   this.shoqgallarydata = true;
  // }

  // closegallary() {
  //   this.shoqgallarydata = false;
  // }

  // toggleGallery(){
  //   this.shoqgallarydata = !this.shoqgallarydata;
  // }


  themes = ['Default', 'yellow', 'blue', 'orange'];
  selectedFile: File | null = null;
  tempBannerImage: string | ArrayBuffer | null = null;

  private scrollPosition = 0;


  navigateTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      const offset = 0; // Adjust the offset value as needed
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

 
loadResume() {
 

  
  const currentUserId =  this.userId;
  
  if (this.blobUrl) {
    URL.revokeObjectURL(this.blobUrl);
    this.blobUrl = null;
  }
 
  this.http.get(
    `http://localhost:8080/personalDetails/${currentUserId}/getResume`,
    {
      responseType: 'blob',
      headers: new HttpHeaders({
        'Accept': 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })
    }
  ).pipe(
    retry(2), // Add retry logic
    catchError((error: HttpErrorResponse) => {
      console.error('Resume load error:', error); // Add error logging
      if (error.status === 404) {
        return throwError(() => 'No resume found');
      }
      return throwError(() => `Failed to load resume: ${error.message}`);
    })
  ).subscribe({
    next: (blob: Blob) => {
      if (blob.size === 0) {
        this.uploadError = 'Empty resume file received';
        this.safeResumeUrl = null;
        return;
      }
      this.blobUrl = URL.createObjectURL(blob);
      this.safeResumeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl);
      console.log('Resume loaded successfully'); // Add success logging
    },
    error: (errorMessage: string) => {
      this.uploadError = errorMessage;
      this.safeResumeUrl = null;
    }
  });
}

selectedContent: string = 'intro'; // Set default view to 'Profile'
 
displayContent(section: string): void {
  this.selectedContent = section;
}

loadVideos(): void {
  
  this.http.get<any>(`http://localhost:8080/selfIntroductionVideos/get/${this.userId}`)
    .subscribe({
      next: (response) => {
        if (response) {
          // Map each video type and check if URLs are present
          this.videos = [
            {
              id: 'personal',
              title: 'Personal Video',
              file: null,
              preview: response.siPersonalS3Uri || null,
              progress: 0,
              error: null,
              url: response.siPersonalS3Uri || null
            },
            {
              id: 'education',
              title: 'Education Video',
              file: null,
              preview: response.siEducationS3Uri || null,
              progress: 0,
              error: null,
              url: response.siEducationS3Uri || null
            },
            {
              id: 'workExperience',
              title: 'Work Experience Video',
              file: null,
              preview: response.siWorkExperienceS3Uri || null,
              progress: 0,
              error: null,
              url: response.siWorkExperienceS3Uri || null
            },
            {
              id: 'achievements',
              title: 'Achievements Video',
              file: null,
              preview: response.siAchievementsS3Uri || null,
              progress: 0,
              error: null,
              url: response.siAchievementsS3Uri || null
            }
          ];

          // Check if all videos have URLs, indicating they are already uploaded
          this.videosExist = this.videos.every(video => video.url !== null);
          console.log("Loaded videos:", this.videos);
        } else {
          console.warn("No videos found in response");
        }
      },
      error: (error) => {
        this.overallError = 'Failed to load videos. Please try again later.';
        console.error('Error loading videos:', error);
      }
    });
}

loadExperiences(userId: number) {
  this.JobUserService.getExperiencesByUserId(userId).subscribe((data) => {
    this.experiences = data || [];
  });
}

loadEducation(userId: number) {
  this.JobUserService.getEducationByUserId(userId).subscribe((data) => {
    this.educationDetails = data as ExtendedEducationDetail[] || [];
  });
}

getYear(date: string): string {
  return new Date(date).getFullYear().toString();
}


// Skill part

  skills: Skill[] = [];
  userSkills: UserSkills[] = [];
  showInfoCard = false;


  // Fetch skills for a user
  getSkills(): void {
    this.JobUserService.getSkillsByUserId(this.userId).subscribe(
      {next:(data) => {
        this.skills = data;
      },
      error:(error) => {
        console.error('Error fetching skills:', error);
      }}
    );
  }


  // Project

  projects: UserProjects[] = [];
    selectedVideo: File | null = null;
sanitizedVideoUrl: SafeResourceUrl | null = null;
sanitizedImageUrl: SafeResourceUrl | null = null; // Add this line
showVideoPlayer = false;
showImageViewer = true;
currentProjectIndex: number | null = null;


// Update fetchProjects method
fetchProjects(): void {
  this.JobUserService.getProjectsByUserId(this.userId).subscribe(
    {next:projects => {
      this.projects = projects;
      this.projects.forEach((project, index) => {
        this.loadAndPlayProjectVideo(project, index);
        this.projects[index].SafeurlVideo = this.sanitizedVideoUrl;
      });
    },
    error:(error) => {
      console.error("Error fetching projects:", error);
    }}
  );
  }

  loadAndPlayProjectVideo(project: UserProjects, index: number): void {
    const projectVideo = project.projectVideo;
  
    // Set the selected project index for conditional rendering
    this.currentProjectIndex = index;
    this.showImageViewer = true;  // Ensure image viewer is closed
    this.showVideoPlayer = false;
  
    if (projectVideo instanceof File) {
      const url = URL.createObjectURL(projectVideo);
      this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.showVideoPlayer = true;
    } else if (typeof projectVideo === 'string') {
      if (this.isValidUrl(projectVideo)) {
        this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(projectVideo);
        this.showVideoPlayer = true;
      } else if (this.isBase64(projectVideo)) {
        const url = `data:video/mp4;base64,${projectVideo}`;
        this.sanitizedVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.showVideoPlayer = true;
      } else {
        console.error("The project video string is not a valid URL or base64 encoded string.");
        this.showVideoPlayer = false;
      }
    } else {
      console.error("The project video is neither a File object nor a valid URL or base64 string.");
      this.showVideoPlayer = false;
    }
  }

  // Helper functions to check if a string is a valid URL or base64 encoded
isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
  }
  
  isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) == str;
  } catch {
    return false;
  }
  }

  
// Add this method to your component class
getBackgroundImageUrl(project: UserProjects): string {
  if (!project.projectImage) {
    return 'url(assets/default-project-image.jpg)';
  }
  
  if (project.projectImage instanceof File) {
    const url = URL.createObjectURL(project.projectImage);
    return `url(${this.sanitizer.sanitize(SecurityContext.URL, url)})`;
  }
  
  if (typeof project.projectImage === 'string') {
    if (this.isValidUrl(project.projectImage)) {
      return `url(${this.sanitizer.sanitize(SecurityContext.URL, project.projectImage)})`;
    }
   
    if (this.isBase64(project.projectImage)) {
      const url = `data:image/jpeg;base64,${project.projectImage}`;
      return `url(${this.sanitizer.sanitize(SecurityContext.URL, url)})`;
    }
  }
  
  return 'url(assets/default-project-image.jpg)';
  }


  setGreetingMessage() {
    const now = new Date();
    const hours = now.getHours();
    let greeting;
  
    if (hours < 12) {
      greeting = 'Good Morning';
    } else if (hours < 18) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }
  
    return {
      timeGreeting: greeting,
      welcomeMessage: 'Welcome'
    };
  }

  videoUrl: SafeResourceUrl = '';
chapters: { label: string; timestamp: number; url: string }[] = [];

gettingCombinedVideo(){
console.log("userid is ...",this.userId);
  this.JobUserService.getSelfIntroVideoData(this.userId).subscribe(
    {next:(combinedResponse) => {
      // Set the initial combined video URL
      console.log("i am hitting1124");
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        combinedResponse.siCombinedS3Uri
      );

      },
    error:(error) => console.error('Error fetching combined video data:', error)
    }
  );
}



}
