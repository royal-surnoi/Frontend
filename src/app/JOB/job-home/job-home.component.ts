import { Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JobsComponent } from '../jobs/jobs.component';
import { MyApplicationsComponent } from '../my-applications/my-applications.component';
import { EducationExperianceComponent } from '../education-experiance/education-experiance.component';
import { SkillsProjectsComponent } from '../skills-projects/skills-projects.component';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { DocumentsComponentComponent, SafeUrlPipe } from '../documents-component/documents-component.component';
import { JobUserService } from '../../job-user.service';
import { DomSanitizer, SafeResourceUrl,  SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../../auth.service';
import { catchError, finalize, retry, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { SavedjobsComponent } from '../savedjobs/savedjobs.component';
import { JobFeedComponent } from '../job-feed/job-feed.component';
import { JobCommunityComponent } from "../job-community/job-community.component";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
 


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
    // bio?:string;
  }
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
// ------combined video --------
interface VideoSegment {
  label: string;
  startTime: number;
  endTime: number;
}
 
interface VideoDurations {
  personal: number;
  education: number;
  workExperience: number;
  achievements: number;
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
interface VideoSegment {
  label: string;
  startTime: number;
  endTime: number;
}
 
interface VideoTimestamps {
  selfIntroTimestamp: number;
  educationTimestamp: number;
  workExpTimestamp: number;
  achievementsTimestamp: number;
}
interface VideoUrls {
  personal: string | undefined;
  education: string | undefined;
  workExperience: string | undefined;
  achievements: string | undefined;
}
 
 
 
interface SelfIntroductionVideos {
  videos: SelfIntroductionVideo[];
}
interface Video {
  id: string;
  title: string;
  url: string | null;
}
 
 
/////////////AI self introduction video integration///////
/////////getting combined video with time stamps/////
export interface SelfIntroductionVideoResponse {
  id?: number;
  siPersonalS3Uri?: string;
  siEducationS3Uri?: string;
  siWorkExperienceS3Uri?: string;
  siAchievementsS3Uri?: string;
  siCombinedS3Uri: string;
  selfIntroTimestamp: number;
  educationTimestamp: number;
  workExpTimestamp: number;
  achievementsTimestamp: number;
}
 
export class VideoUploadComponent {
  videos: SelfIntroductionVideo[] = [];
  overallError: string | null = null;
  uploading: boolean = false;
}
 
 
 
 
 
@Component({
  selector: 'app-job-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, JobsComponent, MyApplicationsComponent, EducationExperianceComponent, SkillsProjectsComponent, PersonalInfoComponent, DocumentsComponentComponent, SafeUrlPipe, SavedjobsComponent, JobFeedComponent, JobCommunityComponent,ToastModule,ButtonModule],
  templateUrl: './job-home.component.html',
  styleUrl: './job-home.component.css',
  providers: [MessageService]  
})
export class JobHomeComponent implements OnInit {
 
 
  interviews: any[] = [];
 
  hasEmptyTheme: boolean = false;
  hasEmptyUserField: boolean = false;
 
  bioExpanded: boolean = false;
 
 
  // setGreetingMessage() {
  //   return {
  //     timeGreeting: 'Good Morning',
  //     welcomeMessage: 'Welcome Back',
  //   };
  // }
 
 
  userId: number | null = 0;
  ShowOverlay: boolean = false;
  isUploadingResume: boolean = false;
  uploadError: string | null = null;
  safeResumeUrl: SafeResourceUrl | null = null;
  private blobUrl: string | null = null;
 
  private readonly maxFileSize = 5 * 1024 * 1024; // 5MB
  private readonly allowedFileTypes = ['.pdf'];
 
  private readonly VideomaxFileSize = 100 * 1024 * 1024; // 100MB
  videosExist: boolean = false;
 
 
  videos: SelfIntroductionVideo[] = [
    { id: 'personalVideo', title: 'Personal Introduction', file: null, progress: 0, error: null, preview: null, url: null },
    { id: 'educationVideo', title: 'Education Background', file: null, progress: 0, error: null, preview: null, url: null },
    { id: 'workExperienceVideo', title: 'Work Experience', file: null, progress: 0, error: null, preview: null, url: null },
    { id: 'achievementsVideo', title: 'Achievements', file: null, progress: 0, error: null, preview: null, url: null }
  ];
 
  private readonly maxvideoFileSize = 100 * 1024 * 1024; // 100MB
  private readonly allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  uploading = false;
  overallError: string | null = null;

 
  //  // Toggle function for expanding/collapsing bio
  //  toggleBio() {
  //   this.bioExpanded = !this.bioExpanded;
  // }
 
  
 
 
  constructor(private JobUserService: JobUserService, private sanitizer: DomSanitizer, private http: HttpClient, private authService: AuthService, private route: ActivatedRoute,private ngZone: NgZone, private messageService: MessageService, private router:Router
 
  ) {
   
  }
 
  ngOnInit() {
    this.loadUserProfile();
    this.loadResume();
    this.loadVideos();
    this.setGreetingMessage();
    this.gettingCombinedVideo();
    this.fetchInterviews();
 
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'] || 'Home';
      console.log('Received Query Params:', params);
      this.activeTab = tab;
      this.JobUserService.setActiveTab(tab);
      if(params['tab'] == ''){
        this.scrollToTab(tab);
      }
    });
    //---combine
    this.loadVideoSegments();
  }
 
  scrollToTab(tab: string) {
    setTimeout(() => {
      const element = document.getElementById(tab);
      if (element) {
        const offset = 0;
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;
 
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 300);
  }
 
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.JobUserService.setActiveTab(tab);
  }
 
 
  // @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoContainer') videoContainer!: ElementRef;
 
  ngAfterViewInit(){
    if(this.activeTab=='Home'){
    this.checkVideoVisibility(); // Initial check when component loads
    if (this.videoPlayer) {
      // Add metadata loaded listener
      this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
        this.updateSegmentTimes();
      });
    }// combined video progress bar
  }
  }
 
 
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.checkVideoVisibility();
  }
 
  // In component
  openMap() {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.user.permanentCity)}`);
  }
 
  openEmail() {
    window.location.href = `mailto:${this.user.user.email}`;
  }
 
  openPhone() {
    window.location.href = `tel:${this.user.phoneNumber}`;
  }
 
  private checkVideoVisibility(): void {
    if(this.activeTab=='Home'){
    if (this.videoContainer.nativeElement.getBoundingClientRect()) {
 
      const rect = this.videoContainer.nativeElement.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
 
      if (!isVisible) {
        this.videoPlayer.nativeElement.pause();
      }
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
 
    // -------comined videos----
   
  }
 
 
  // userId : number = 0;
  loadUserProfile() {
    this.userId = Number(localStorage.getItem("id"));
    console.log(this.userId)
 
    this.JobUserService.getUserProfile(Number(this.userId)).subscribe({
      next: (profile) => {
        this.user = profile;
        if (profile.user.userImage) {
          this.user.user.userImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${profile.user.userImage}`);
          this.user.theme = this.user.theme.toLowerCase();
          this.currentTheme = this.user.theme;
          this.previewTheme = this.user.theme;
          if (profile.bannerImage) {
            this.user.bannerImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${profile.bannerImage}`);
            console.log(this.user.bannerImage);
          }
        }
        this.checkFields(this.user)
        this.isloaded = true;
        // console.log(this.user.user.userImage)
      },
      error: (error) => {
        console.log(error);
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
 
 
  checkFields(user: User): void {
    // Define required fields to check
    const requiredFields: (keyof User)[] = [
      'userDescription',
      'profession',
      'permanentCity',
      'permanentState',
      'permanentCountry',
      'phoneNumber'
    ];
 
    // const requiredFields2: (keyof User)[] = [
    //   'theme'
    // ];
 
    // Check main user fields
    const hasEmptyRequiredField = requiredFields.some(
      field => {
        const value = user[field];
        return value === '' || value === null || value === undefined;
      }
    );
 
    // Check nested user fields
    this.hasEmptyUserField =
      !user.user.name ||
      !user.user.email || !user.user.userImage;
 
 
 
    this.ShowPopup = hasEmptyRequiredField || this.hasEmptyUserField;
    if (this.ShowPopup) {
      return
    }
  
  }
 
  getBannerImageUrl(): string {
    if (this.user && this.user.bannerImage) {
      // console.log(this.user.bannerImage.toString().replace("SafeValue must use [property]=binding: ", ""))
      const newlink = `url('${this.user.bannerImage.toString().replace("SafeValue must use [property]=binding: ", "").replace(" (see https://g.co/ng/security", "")}')`;
      return newlink;
    }
    return "";
  }
 
 
 
  user!: User;
  shoqgallarydata: boolean = false;
  activeTab: string = 'Home'; // Default active tab  
  Add: any;
  showEditCaution: boolean = false;
  showEditOptions: boolean = false;
  currentTheme: string = "";
  previewTheme: string = "";
  ShowPopup: boolean = false
  isloaded: boolean = false;
 
 
 
  showgallary() {
    this.shoqgallarydata = true;
  }
 
  closegallary() {
    this.shoqgallarydata = false;
  }
 
  toggleGallery() {
    this.shoqgallarydata = !this.shoqgallarydata;
  }
 
 
  themes = ['Default', 'yellow', 'blue', 'orange'];
  selectedFile: File | null = null;
  tempBannerImage: string | ArrayBuffer | null = null;
 
  private scrollPosition = 0;
 
 
  cancelEditOptions() {
    this.showEditOptions = !this.showEditOptions;
    window.scrollTo(0, this.scrollPosition); // Restore the scroll position
    if (!this.showEditOptions) {
      this.resetPreview();
    }
  }
 
  toggleEditOptions() {
    this.showEditOptions = true;
  }
 
  previewThemeChange(theme: string) {
    this.previewTheme = theme;
    this.user.theme = theme;
  }
 
 
 
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempBannerImage = e.target.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
  saveChanges() {
    let isbannerError = 0;
    let isTheameError = 0;
    if (this.tempBannerImage && this.previewTheme && this.selectedFile) {
      this.user.bannerImage = this.tempBannerImage as string;
      this.user.theme = this.previewTheme
      this.currentTheme = this.previewTheme;
      this.JobUserService.setUserTheame(Number(this.userId), this.previewTheme).subscribe({
        next: (profile) => {
        },
        error: (error) => {
          console.log(error.message);
          isbannerError = 1;
        }
      });
      this.JobUserService.setUserBanner(Number(this.userId), this.selectedFile).subscribe({
        next: (profile) => {
          console.log(profile)
        },
        error: (error) => {
          console.log(error.message);
          isTheameError = 1;
        }
      });
      this.resetPreview();
      this.showEditOptions = false;
      this.showEditCaution = false;
      if (isbannerError == 1 && isTheameError == 1) {
        alert("Something went wrong!!")
        return
      }
      else if (isbannerError == 1) {
        alert("Banner Image Must be lessthen 16mb!!")
        return
      }
      else if (isTheameError == 1) {
        alert("Theme not Updates Successfully!!!")
        return
      }
      alert('Changes saved successfully!');
      return
    }
    alert('Select Theme and Banner Image!');
  }
 
 
  saveThemeChanges() {
    this.currentTheme = this.previewTheme;
    this.user.theme = this.previewTheme;
    this.JobUserService.setUserTheame(Number(this.userId), this.previewTheme).subscribe({
      next: (profile) => {
      },
      error: (error) => {
        console.log(error.message);
        alert('Theame not Changed successfully!');
      }
    });
    this.resetPreview();
    this.showEditOptions = false;
    alert('Theame Changed successfully!');
  }
 
  saveBannerChanges() {
    if (this.tempBannerImage && this.selectedFile) {
      this.user.bannerImage = this.tempBannerImage as string;
      this.JobUserService.setUserBanner(Number(this.userId), this.selectedFile).subscribe({
        next: (profile) => {
          console.log(profile)
        },
        error: (error) => {
          console.log(error);
          alert("Image Must be less then 16mb!!")
      
        }
      });
      this.resetPreview();
      this.showEditOptions = false;
      alert('Banner Changed successfully!');
      return
    }
 
    alert("Select Banner Image!!")
  }
 
 
  resetPreview() {
    this.previewTheme = this.currentTheme;
    this.user.theme = this.currentTheme;
    this.selectedFile = null;
    this.tempBannerImage = null;
  }
 
 
 
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
 
  validateFile(file: File): string | null {
    if (file.size > this.maxFileSize) {
      return 'File size exceeds 5MB limit';
    }
 
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedFileTypes.includes(fileExtension)) {
      return 'Only PDF, DOC, and DOCX files are allowed';
    }
 
    return null;
  }
 
  // 1. Add error logging in uploadResume method
  uploadResume(event: any) {
    const currentUserId = Number(localStorage.getItem("id"))
    const file = event.target.files[0];
    if (!file) return;
 
    this.uploadError = null;
 
    const validationError = this.validateFile(file);
    if (validationError) {
      this.uploadError = validationError;
      alert('Invalid file. Please upload a PDF file under 5MB.');
      return;
    }
 
    this.isUploadingResume = true;
    const formData = new FormData();
    formData.append('file', file);
 
    this.http.post(
      `http://localhost:8080/personalDetails/${currentUserId}/uploadResume`,
      formData,
      { responseType: 'text' }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Resume upload error:', error); // Add error logging
        let errorMessage = 'Failed to upload resume';
        if (error.status === 431) {
          this.messageService.add({
 
            severity: 'error',
   
            summary: 'Error',
   
            detail: 'Request too large. Please try a smaller file.'
   
          })
        }
        return throwError(() => errorMessage);
      }),
      finalize(() => {
        this.isUploadingResume = false;
      })
    ).subscribe({
      next: (response) => {
        console.log('Upload successful:', response); // Add success logging
        this.messageService.add({
 
          severity: 'success',
 
          summary: 'Success',
 
          detail: 'Upload successful'
 
        });
        this.loadResume();
      },
      error: (errorMessage: string) => {
        this.uploadError = errorMessage;
      }
    });
  }
 
  loadResume() {
    const currentUserId = Number(localStorage.getItem("id"))
 
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
 
  
 
  private validateVideoFile(file: File): string | null {
    if (file.size > this.maxvideoFileSize) {
      return 'File size exceeds 100MB limit';
    }
 
    if (!this.allowedTypes.includes(file.type)) {
      return 'Only MP4, WebM, and OGG video formats are allowed';
    }
 
    return null;
  }
 
 
 
  onVideoFileSelected(event: any, videoId: string): void {
    const file = event.target.files[0];
    const video = this.videos.find(v => v.id === videoId);
 
    if (!video) return;
 
    // Reset states
    video.error = null;
    video.progress = 0;
 
    if (video.preview) {
      URL.revokeObjectURL(video.preview);
      video.preview = null;
    }
 
    if (!file) {
      video.file = null;
      return;
    }
 
    // Validate file
    const validationError = this.validateVideoFile(file);
    if (validationError) {
      video.error = validationError;
      return;
    }
 
    video.file = file;
    video.preview = URL.createObjectURL(file);
 
    // Call the PUT method for videos
    this.uploadVideo(videoId, file);
  }
 
  // PUT method for videos in the component
  uploadVideo(videoId: string, file: File | null): void {
    // Fetch userId from local storage
    const userId = Number(localStorage.getItem("id"));
    if (!userId) {
      console.error('User ID is not available in local storage.');
      return;
    }
 
    // Prepare file data or null based on the video ID
    const personalVideo = videoId === 'personal' ? file : null;
    const educationVideo = videoId === 'education' ? file : null;
    const workExperienceVideo = videoId === 'workExperience' ? file : null;
    const achievementsVideo = videoId === 'achievements' ? file : null;
 
    // console.log(personalVideo!=null , educationVideo!=null , workExperienceVideo!=null , achievementsVideo!=null)
    if(this.videoData!=null){
    // Call the service method
    this.JobUserService.updateSelfIntroductionVideos(
      userId,
      personalVideo,
      educationVideo,
      workExperienceVideo,
      achievementsVideo
    ).subscribe({
      next: (response) => {
        console.log('Video uploaded successfully:', response, 'userId', userId);
  
        this.messageService.add({
 
          severity: 'success',
 
          summary: 'Success',
 
          detail: 'Video uploaded successfully!'
 
        });
        this.loadVideos();
        this.handleCombine();
      },
      error: (error) => {
        console.error('Video upload failed:', error);
        this.messageService.add({
 
          severity: 'error',
   
          summary: 'Error',
   
          detail: 'Video upload failed. Please try again'
   
        });
      }
    });
  }
  }
 
  uploadAll(): void {
    if (this.uploading) return;
 
    this.overallError = null;
 
    // Check if any videos are selected
    const videosToUpload = this.videos.filter(v => v.file);
    if (videosToUpload.length === 0) {
      this.overallError = 'Please select at least one video to upload';
      return;
    }
 
    this.uploading = true;
 
    const formData = new FormData();
    videosToUpload.forEach(video => {
      if (video.file) {
        formData.append(video.id, video.file);
      }
    });
 
    const userId = Number(localStorage.getItem("id"))
    const headers = new HttpHeaders({
      'Accept': 'application/json'
    });
 
    this.http.post<{ videos: Video[] }>(
      `http://localhost:8080/selfIntroductionVideos/${userId}/upload`,
      formData,
      {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage: string;
        // ... error handling remains the same ...
        return throwError(() => errorMessage!);
      }),
      finalize(() => {
        this.uploading = false;
      })
    ).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = Math.round(100 * event.loaded / event.total);
          videosToUpload.forEach(video => video.progress = progress);
        } else if (event.type === HttpEventType.Response) {
          if (event.body && event.body.videos) {
            // Update videos with server response
            this.videos = this.videos.map(video => {
              const uploadedVideo = event.body.videos.find((v: Video) => v.id === video.id);
              return {
                ...video,
                file: null,
                progress: 0,
                url: uploadedVideo?.url || video.url,
                preview: uploadedVideo?.url || null
              };
            });
 
            // Show success message
            // alert('Videos uploaded successfully!');
            this.messageService.add({
 
              severity: 'success',
     
              summary: 'Success',
     
              detail: 'Video uploaded successfully!'
     
            });
 
            // Reload videos from server to ensure everything is in sync
            this.handleCombine();
            this.loadVideos();
          }
        }
      },
      error: (error: string) => {
        this.overallError = error;
        console.error('Upload error:', error);
        this.videos.forEach(video => video.progress = 0);
      }
    });
  }
 
 
  removeVideo(videoId: string): void {
    const video = this.videos.find(v => v.id === videoId);
    if (video) {
      if (video.preview) {
        URL.revokeObjectURL(video.preview);
      }
      video.file = null;
      video.preview = null;
      video.progress = 0;
      video.error = null;
    }
  }
 
  loadVideos(): void {
    const userId = Number(localStorage.getItem("id"));
    this.http.get<any>(`http://localhost:8080/selfIntroductionVideos/get/${userId}`)
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
 
  // In the existing setGreetingMessage() method, you can modify it slightly
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
      welcomeMessage: 'Welcome Back!'
    };
  }

  
 
 
  /////////////AI self introduction video integration///////
  response: any;
  handleCombine() {
    console.log("hi prasad");
 
    this.userId = Number(localStorage.getItem("id"));
    this.JobUserService.combineVideos(this.userId).subscribe(
      {next:(res) => {
        console.log(res);
        this.response = res;
      },
      error:(error) => {
        console.error('Error combining videos:', error);
      }}
    );
  }
 
 
  /////////getting combined video with time stamps/////
 
 
  currentVideoSrc: string = '';
  currentVideoType: string = 'combined';
  videoData: SelfIntroductionVideoResponse |null=null;
 
  combinedVideoUrl: any;
  currentSegmentIndex: number = 0;
  hoverLabel: string = '';
  tooltipPosition: number = 0;
  progressPercentage: number = 0;
  showPreview: boolean = false;
  previewPosition: number = 0;
  previewTime: number = 0;
  isDragging: boolean = false;
  isFullscreen: boolean = false;
  private animationFrameId: number | null = null;
  currentSegmentLabel: string = '';
  currentTime: number = 0;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
 
  // Define segments
 
  // videoSegments: VideoSegment[] = [
  //   { label: 'Self Introduction', startTime: 0, endTime: 60 },
  //   { label: 'Education', startTime: 60, endTime: 120 },
  //   { label: 'Work Experience', startTime: 120, endTime: 180 },
  //   { label: 'Achievements', startTime: 180, endTime: 240 }
  // ];
  videoSegments: VideoSegment[] = [];
  gettingCombinedVideo() {
    this.userId = Number(localStorage.getItem("id"));
    console.log("userid is ...", this.userId);
    this.JobUserService.getSelfIntroVideoData(this.userId).subscribe({
      next: (combinedVideo: SelfIntroductionVideoResponse) => {
        this.videoData = combinedVideo;
        this.playVideo('combined');
      },
      error: (error: any) => {
        console.error('Error loading combined video:', error);
      }
    });
   
  }
  updateSegmentTimes() {
    const totalDuration = this.videoPlayer.nativeElement.duration;
    // Update segment times based on actual video duration
    this.videoSegments = this.videoSegments.map(segment => ({
      ...segment,
      startTime: (segment.startTime / 240) * totalDuration,
      endTime: (segment.endTime / 240) * totalDuration
    }));
  }
 
 
  // gettingCombinedVideo() {
  //   this.userId = Number(localStorage.getItem("id"));
  //   this.JobUserService.getSelfIntroVideoData(this.userId).subscribe(
  //     combinedVideo => {
  //       this.combinedVideoUrl = combinedVideo.siCombinedS3Uri;
  //       this.currentVideoSrc = this.combinedVideoUrl;
  //     }
  //   );
  // }
 
  playVideo(type: string) {
    if (!this.videoData) return;
 
    this.currentVideoType = type;
    switch (type) {
      case 'combined':
        this.currentVideoSrc = this.videoData.siCombinedS3Uri;
        break;
      case 'selfIntro':
        this.currentVideoSrc = this.videoData.siPersonalS3Uri || '';
        break;
      case 'education':
        this.currentVideoSrc = this.videoData.siEducationS3Uri || '';
        break;
      case 'workExp':
        this.currentVideoSrc = this.videoData.siWorkExperienceS3Uri || '';
        break;
      case 'achievements':
        this.currentVideoSrc = this.videoData.siAchievementsS3Uri || '';
        break;
    }
  }
 
  onMetadataLoaded() {
    const videoPlayer = document.querySelector('video') as HTMLVideoElement;
    if (videoPlayer && this.videoData) {
      switch (this.currentVideoType) {
        case 'selfIntro':
          videoPlayer.currentTime = this.videoData.selfIntroTimestamp;
          break;
        case 'education':
          videoPlayer.currentTime = this.videoData.educationTimestamp;
          break;
        case 'workExp':
          videoPlayer.currentTime = this.videoData.workExpTimestamp;
          break;
        case 'achievements':
          videoPlayer.currentTime = this.videoData.achievementsTimestamp;
          break;
      }
    }
  }
 
 
 
  fetchInterviews(): void {
    const apiUrl = `http://localhost:8080/api/interviews/today/user/${this.userId}`;
    this.http.get<any[]>(apiUrl).subscribe((data) => {
      this.interviews = data;
    });
  }
 
  formatTimeForInteview(timestamp: number[]): string {
    const [year, Month, date, hours, minutes] = timestamp;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${date}-${Month}-${year} ${displayHours}:${displayMinutes} ${period}`;
  }
  seekToSegment(startTime: number): void {
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.currentTime = startTime;
      video.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }
 
 
  onProgressBarHover(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const position = event.clientX - rect.left;
    const percentage = position / rect.width;
   
    if (this.videoPlayer) {
      const time = this.videoPlayer.nativeElement.duration * percentage;
      const segment = this.findSegmentAtTime(time);
     
      if (segment) {
        this.hoverLabel = segment.label;
        this.tooltipPosition = event.clientX;
      }
    }
  }
  // Get segment position in percentage
  getSegmentPosition(segment: { startTime: number }): number {
    const totalDuration = this.videoSegments[this.videoSegments.length - 1].endTime;
    return (segment.startTime / totalDuration) * 100;
  }
 
  // Seek to segment start time
  // seekToSegment(startTime: number): void {
  //   const videoPlayer = document.querySelector('video') as HTMLVideoElement;
  //   if (videoPlayer) {
  //     videoPlayer.currentTime = startTime;
  //   }
  // }
 
  // Show hover tooltip
  onHover(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const x = event.clientX - rect.left; // Mouse X position relative to the progress bar
    const percentage = (x / rect.width) * 100;
 
    // Find the hovered segment
    for (let segment of this.videoSegments) {
      const segmentStart = this.getSegmentPosition(segment);
      const segmentEnd = segmentStart + this.getSegmentWidth(segment);
      if (percentage >= segmentStart && percentage <= segmentEnd) {
        this.hoverLabel = segment.label;
        this.tooltipPosition = x; // Tooltip follows the mouse
        break;
      }
    }
  }
 
  // Hide tooltip on mouse leave
  onMouseLeave(): void {
    this.hoverLabel = '';
  }
  @ViewChild('chapterTooltip') chapterTooltip!: ElementRef;
 
 
  // onTimeUpdate(): void {
  //   if (this.videoPlayer) {
  //     const video = this.videoPlayer.nativeElement;
  //     this.progressPercentage = (video.currentTime / video.duration) * 100;
  //   }
  // }
 
  // onProgressBarClick(event: MouseEvent): void {
  //   const progressBar = event.currentTarget as HTMLElement;
  //   const rect = progressBar.getBoundingClientRect();
  //   const clickPosition = event.clientX - rect.left;
  //   const percentage = clickPosition / rect.width;
   

 
 
 
  onProgressBarMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.updateVideoTime(event);
   
    const onMouseMove = (e: MouseEvent) => {
      if (this.isDragging) {
        this.updateVideoTime(e);
      }
    };
   
    const onMouseUp = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
   
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }
 
  onProgressBarMouseMove(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const position = event.clientX - rect.left;
   
    this.previewPosition = position;
    const percentage = position / rect.width;
   
    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;
      this.previewTime = video.duration * percentage * 1000; // Convert to milliseconds for date pipe
    }
  }
 
  private updateVideoTime(event: MouseEvent) {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
   
    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;
      video.currentTime = video.duration * percentage;
    }
  }
 
 
 
  handleTimelineHover(event: Event) {
    const mouseEvent = event as MouseEvent;
    const timeline = event.target as HTMLElement;
    const rect = timeline.getBoundingClientRect();
    const position = (mouseEvent.clientX - rect.left) / rect.width;
   
    // Calculate time based on position
    const time = this.videoPlayer.nativeElement.duration * position;
   
    // Find current segment
    const segment = this.findSegmentAtTime(time);
   
    if (segment) {
      const tooltip = this.chapterTooltip.nativeElement;
      tooltip.textContent = segment.label;
      tooltip.style.display = 'block';
      tooltip.style.left = `${mouseEvent.clientX - tooltip.offsetWidth / 2}px`;
      tooltip.style.top = `${mouseEvent.clientY - tooltip.offsetHeight - 10}px`;
    }
  }
 
  handleTimelineClick(event: Event) {
    const mouseEvent = event as MouseEvent;
    const timeline = event.target as HTMLElement;
    const rect = timeline.getBoundingClientRect();
    const position = (mouseEvent.clientX - rect.left) / rect.width;
    const time = this.videoPlayer.nativeElement.duration * position;
   
    this.videoPlayer.nativeElement.currentTime = time;
  }
  getSegmentWidth(segment: VideoSegment): number {
    const video = this.videoPlayer?.nativeElement;
    if (!video?.duration) return 0;
   
    const totalDuration = video.duration;
    const segmentDuration = segment.endTime - segment.startTime;
    return (segmentDuration / totalDuration) * 100;
  }
 
 
  getCurrentSegment(): VideoSegment | undefined {
    return this.videoSegments.find(segment =>
      this.currentTime >= segment.startTime && this.currentTime < segment.endTime
    );
  }
  // onTimeUpdate(): void {
  //   if (this.videoPlayer) {
  //     const video = this.videoPlayer.nativeElement;
  //     this.progressPercentage = (video.currentTime / video.duration) * 100;
  //   }
  // }
  onTimeUpdate(): void {
    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;
      this.progressPercentage = (video.currentTime / video.duration) * 100;
    }
  }
 
  onProgressBarClick(event: MouseEvent): void {
    const progressBar = event.currentTarget as HTMLElement;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = event.clientX - rect.left;
    const percentage = clickPosition / rect.width;
   
    if (this.videoPlayer) {
      const video = this.videoPlayer.nativeElement;
      video.currentTime = video.duration * percentage;
    }
  }
 
  findSegmentAtTime(time: number): VideoSegment | undefined {
    return this.videoSegments.find(segment =>
      time >= segment.startTime && time < segment.endTime
    );
  }
  loadVideoSegments() {
    const currentUserId = Number(localStorage.getItem("id"))
    this.JobUserService.getIndividualVideos(currentUserId).subscribe({
      next: async (individualVideos: any) => {
        const videoUrls: VideoUrls = {
          personal: individualVideos.siPersonalS3Uri,
          education: individualVideos.siEducationS3Uri,
          workExperience: individualVideos.siWorkExperienceS3Uri,
          achievements: individualVideos.siAchievementsS3Uri
        };
 
        const durations = await this.getVideoDurations(videoUrls);
 
        let currentTime = 0;
        this.videoSegments = [
          {
            label: 'Self Introduction',
            startTime: currentTime,
            endTime: currentTime + durations['personal']
          },
          {
            label: 'Education',
            startTime: currentTime + durations['personal'],
            endTime: currentTime + durations['personal'] + durations['education']
          },
          {
            label: 'Work Experience',
            startTime: currentTime + durations['personal'] + durations['education'],
            endTime: currentTime + durations['personal'] + durations['education'] + durations['workExperience']
          },
          {
            label: 'Achievements',
            startTime: currentTime + durations['personal'] + durations['education'] + durations['workExperience'],
            endTime: currentTime + durations['personal'] + durations['education'] + durations['workExperience'] + durations['achievements']
          }
        ];
 
        this.gettingCombinedVideo();
      },
      error: (error: any) => {
        console.error('Error loading individual videos:', error);
      }
    });
  }
  private async getVideoDurations(videos: VideoUrls): Promise<VideoDurations> {
    const durations: VideoDurations = {
      personal: 0,
      education: 0,
      workExperience: 0,
      achievements: 0
    };
   
    const entries = Object.entries(videos) as [keyof VideoUrls, string | undefined][];
   
    for (const [key, url] of entries) {
      if (url) {
        durations[key] = await this.getVideoDuration(url);
      }
    }
   
    return durations;
  }
 
  private getVideoDuration(url: string): Promise<number> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        resolve(video.duration);
      });
      video.addEventListener('error', () => {
        resolve(0); // Return 0 duration if video fails to load
      });
    });
  }
 
  tabKeys: string[] = [
    'Home',
    'jobs',
    'myApplications',
    'Upcoming',
    'skillsProjects',
    'experienceEducation',
    'personalInfo',
    'community',
    'feed',
    'Document',
    'SavedJobs'
  ];
 
  // Get the current active index
  get activeIndex(): number {
    return this.tabKeys.indexOf(this.activeTab);
  }
 
  // Navigate to a specific tab by index
  navigateToTab(index: number): void {
    const normalizedIndex = (index + this.tabKeys.length) % this.tabKeys.length; // Handle wrapping
    this.activeTab = this.tabKeys[normalizedIndex];
  }
 
  // Listen for keyboard events
  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') {
      this.navigateToTab(this.activeIndex + 1); // Go to the next tab
    } else if (event.key === 'ArrowLeft') {
      this.navigateToTab(this.activeIndex - 1); // Go to the previous tab
    }
  }
 
 
  isNavbarOpen = false;
 
  toggleNavbar() {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

 isPendulumActive = true; // Flag to control pendulum animation
 
  scrollLeft() {
    const navbar = document.querySelector('.navbar-tabs');
    if (navbar) {
      navbar.scrollBy({
        left: -200, // Adjust scroll distance
        behavior: 'smooth'
      });
    }
    this.stopPendulum(); // Stop pendulum animation when arrow is clicked
    this.updateTab('left');
  }
 
  scrollRight() {
    const navbar = document.querySelector('.navbar-tabs');
    if (navbar) {
      navbar.scrollBy({
        left: 200, // Adjust scroll distance
        behavior: 'smooth'
      });
    }
    this.stopPendulum(); // Stop pendulum animation when arrow is clicked
    this.updateTab('right');
  }
 
  stopPendulum() {
    this.isPendulumActive = false; // Stop the pendulum animation
    setTimeout(() => {
      this.isPendulumActive = true; // Restart pendulum animation after a delay
    }, 500); // Delay before restarting the animation
  }
 
  updateTab(direction: string) {
    const tabOrder = [
      'Home', 'jobs', 'myApplications', 'Upcoming', 'personalInfo', 'community', 'feed', 'Document', 'SavedJobs'
    ];
 
    let currentIndex = tabOrder.indexOf(this.activeTab);
 
    if (direction === 'left' && currentIndex > 0) {
      this.activeTab = tabOrder[currentIndex - 1];
    } else if (direction === 'right' && currentIndex < tabOrder.length - 1) {
      this.activeTab = tabOrder[currentIndex + 1];
    }
  }
 
  navigateToAiresume(){
    this.router.navigate(['/airesume']);
  }
 
 
 

}
 
 
 
