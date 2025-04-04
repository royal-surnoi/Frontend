import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FusionService } from '../fusion.service';
import { environment } from '../../environments/environment';
import { forkJoin, mergeMap, Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UploadPostService } from './upload-post.service';



interface User {
  id: number;
  name: string;
  email: string;
  userImage: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BasePost {
  id: number;
  user: User;
  jobadmin:any;
  postDate: string | null;
  updatedDate: string | null;
  tag: string | null;
  category: string;
}

interface ShortVideo extends BasePost {
  content_type?: 'short_video';
  shortVideoTitle: string;
  s3Url: string;
  shortVideoDescription: string;
  shortVideoLikes: number;
  shortVideoShares: number;
  shortVideoViews: number;
  shortVideoDuration: string;
  isLiked?: boolean;
}

interface LongVideo extends BasePost {
  content_type?: 'long_video';
  longVideoTitle: string;
  s3Url: string;
  longVideoDescription: string;
  longVideoLikes: number;
  longVideoShares: number;
  longVideoViews: number;
  longVideoDuration: string;
  isLiked?: boolean;
}

interface Article extends BasePost {
  content_type?: 'article_post';
  article: string;
  articleLikeCount: number;
  articleDislikes: number;
  articleShareCount: number;
  isLiked?: boolean;
}

interface ImagePost extends BasePost {
  photo: string;
  imageDescription: string;
  imageLikeCount: number;
  imageDislikes: number;
  imageShareCount: number;
  isLiked?: boolean;
}

type Post = ShortVideo | LongVideo | Article | ImagePost;

interface Person {
  id: number;
  name: string;
  email: string;
  username: string;
  isActive: boolean;
  isLoading: boolean;
  isVisible: boolean;
}


@Component({
  selector: 'app-education-dash-board',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './education-dash-board.component.html',
  styleUrl: './education-dash-board.component.css'
})
export class EducationDashBoardComponent {
  posts: Post[] = [];
  isloaded: boolean = false;
  userId!: number;
  private apiBaseUrlAI = environment.apiBaseUrlAI;
  showquotepopup : boolean = false;

  mentorList: Person[] = [];
  filteredMentorList: Person[] = [];
  searchText: string = '';
  searchTerm: string = '';

  apiBaseUrl: string = '';
  hoveredComment: number | null = null;

  tempquote:string = "Success is not about making giant leaps overnight but about taking consistent small steps forward. Every effort, no matter how small, brings you closer to your goal."





  constructor(private fusionService2: UploadPostService, private http: HttpClient, private sanitizer: DomSanitizer, private fusionService: FusionService, private router: Router
  ) { }

  ngOnInit(): void {
    this.apiBaseUrl = environment.apiBaseUrl;
    this.getGreeting();
    this.fetchUserProfileDetails()
    this.fetchPosts();
    this.getMentorsListToFollow();
    this.scrollToTop();
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showQuotePopup(event: Event) {
    event.preventDefault(); // Prevents redirection
    this.showquotepopup = true;
  }
  

  // fetchPosts(): void {
  //   this.userId = Number(localStorage.getItem("id"));
  //   this.http.get<Post[]>(`${this.apiBaseUrlAI}/edu_feed/${this.userId}`)
  //     .subscribe({
  //       next: (response) => {
  //         this.posts = response;
  //         console.log('Posts loaded:', this.posts);
  //         this.isloaded = true;
  //       },
  //       error: (error) => {
  //         console.error('Error fetching posts:', error);
  //       }
  //     });
  // }

  isShortVideo(post: Post): post is ShortVideo {
    return 'shortVideoTitle' in post;
  }

  isLongVideo(post: Post): post is LongVideo {
    return 'longVideoTitle' in post;
  }

  isArticle(post: Post): post is Article {
    return 'article' in post;
  }

  isImagePost(post: Post): post is ImagePost {
    return 'photo' in post;
  }

  getLikes(post: Post): number {
    if (this.isShortVideo(post)) return post.shortVideoLikes;
    if (this.isLongVideo(post)) return post.longVideoLikes;
    if (this.isArticle(post)) return post.articleLikeCount;
    if (this.isImagePost(post)) return post.imageLikeCount;
    return 0;
  }

  getShares(post: Post): number {
    if (this.isShortVideo(post)) return post.shortVideoShares;
    if (this.isLongVideo(post)) return post.longVideoShares;
    if (this.isArticle(post)) return post.articleShareCount;
    if (this.isImagePost(post)) return post.imageShareCount;
    return 0;
  }

  getViews(post: Post): number {
    if (this.isShortVideo(post)) return post.shortVideoViews;
    if (this.isLongVideo(post)) return post.longVideoViews;
    return 0;
  }

  getContent(post: Post): string {
    if (this.isShortVideo(post)) return post.shortVideoDescription;
    if (this.isLongVideo(post)) return post.longVideoDescription;
    if (this.isArticle(post)) return post.article;
    if (this.isImagePost(post)) return post.imageDescription;
    return '';
  }

  formatDate(date: string | null): string {
    if (!date) return 'Unknown date';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getimage(userImage: any): string | SafeUrl {
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${userImage}`);
    return sanitizedUrl;
  }

  personalDetails: any = {};
  userImage: SafeUrl | null = null;


  fetchUserProfileDetails(): void {
    console.log("I am Hitting")
    const userId = localStorage.getItem('id');
    if (userId) {
      console.log("I am Hitting2")
      this.fusionService.getUserprofileById(userId).subscribe({
        next: (data) => {
          this.personalDetails = data;
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
        }
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }

  Greetings: string = "";

  getGreeting() {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      this.Greetings = 'Good Morning!';
    } else if (currentHour >= 12 && currentHour < 17) {
      this.Greetings = 'Good Afternoon!';
    } else if (currentHour >= 17 && currentHour < 21) {
      this.Greetings = 'Good Evening!';
    } else {
      this.Greetings = 'Good Night!';
    }
  }

  private getMentorsListToFollow(): void {
    const userId = localStorage.getItem('id');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }

    // Prepare user data object dynamically
    const userData = { user_id: Number(userId) };

    forkJoin({
      userDetails: this.http.post<any[]>(`${environment.apiBaseUrlAI}/mentor_suggestions`, userData).pipe(
        mergeMap(res => forkJoin(res.map(id => this.http.get<any>(`${environment.apiBaseUrl}/user/find/${id}`))))
      ),
      followingIds: this.getFollowingIds()
    }).subscribe({
      next: ({ userDetails, followingIds }) => {
        this.mentorList = userDetails.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.email.split('@')[0],
          isActive: followingIds.includes(user.id),
          isLoading: false,
          isVisible: !followingIds.includes(user.id)
        }));
        this.filterMentors();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  private getFollowingIds(): Observable<number[]> {
    return this.userId
      ? this.http.get<number[]>(`${environment.apiBaseUrl}/follow/findFollowingIdsByFollowerId/${this.userId}`)
      : of([]);
  }

  filterMentors(): void {
    this.filteredMentorList = this.searchText
      ? this.mentorList.filter(mentor =>
        mentor.isVisible &&
        (mentor.username.toLowerCase().includes(this.searchText.toLowerCase()) ||
          mentor.name.toLowerCase().includes(this.searchText.toLowerCase()))
      )
      : this.mentorList.filter(mentor => mentor.isVisible);
  }

  sendingFollowRequest(event: Event, personId: number): void {
    event.stopPropagation();

    if (!this.userId) {
      console.error('User ID not found in localStorage');
      alert('User ID not found. Please log in again.');
      return;
    }

    const userIdNumber = Number(this.userId);
    if (isNaN(userIdNumber)) {
      console.error('Invalid user ID in localStorage');
      alert('Invalid user ID. Please log in again.');
      return;
    }

    this.http.post(`${environment.apiBaseUrl}/follow/saveByIds?followerId=${userIdNumber}&followingId=${personId}`, {})
      .subscribe({
        next: (res: any) => {
          const person = this.mentorList.find(p => p.id === personId);
          if (person) {
            person.isActive = true;
            person.isLoading = false;
            person.isVisible = false;
          }
          this.filterMentors();
          alert('Follow request sent successfully!');
        },
        error: (error) => {
          console.error('Error sending follow request', error);
          alert('Error sending follow request. Please try again.');
          const person = this.mentorList.find(p => p.id === personId);
          if (person) {
            person.isLoading = false;
          }
        }
      });
  }

  togglePerson(person: Person): void {
    if (person.isLoading) return;

    person.isLoading = true;
    person.isActive = !person.isActive;

    if (person.isActive) {
      this.loadPersonData(person);
    } else {
      this.unloadPersonData(person);
    }
  }

  private loadPersonData(person: Person): void {
    setTimeout(() => {
      person.isLoading = false;
      this.filterMentors();
    }, 1000);
  }

  private unloadPersonData(person: Person): void {
    setTimeout(() => {
      person.isLoading = false;
      this.filterMentors();
    }, 10);
  }

  handleSearch(): void {
    if (this.searchTerm?.trim()) {
      this.router.navigate(['/candidateview/learningPage', encodeURIComponent(this.searchTerm.trim())]);
    }
  }

  likedComments: { [key: number]: boolean } = {}; // Store liked status for each comment


  // adding new Posts

  showPopup: boolean = false;
  newPost: any;
  preview!: string;
  droppedImage!: File | null;
  droppedVideo!: File | null;
  droppedShortVideo!: File | null;
  droppedShortVideoBlob!: Blob | MediaSource;
  tag: string = '';
  Description: string = '';
  title: string = '';
  shorts: any;
  errorMessage: string | undefined;
  selectedOption: string = 'article';
  isuploading: boolean = false;




  @ViewChild('imageFileInput', { static: false }) imageFileInput: any;
  @ViewChild('videoFileInput', { static: false }) videoFileInput: any;
  @ViewChild('shortVideoFileInput', { static: false }) shortVideoFileInput: any;

  selectOption(option: string) {
    this.preview = '';
    this.droppedImage = null;
    this.droppedVideo = null;
    this.droppedShortVideo = null;
    this.Description = '';
    this.title = '';
    this.tag = '';
    this.selectedOption = option;
  }

  triggerFileInput(inputName: string): void {
    let fileInputElement: any;

    if (inputName === 'image') {
      fileInputElement = this.imageFileInput;
    } else if (inputName === 'video') {
      fileInputElement = this.videoFileInput;
    } else if (inputName === 'shortVideo') {
      fileInputElement = this.shortVideoFileInput;
    }
    if (fileInputElement) {
      fileInputElement.nativeElement.click();
    } else {
      console.error('File input reference is undefined');
    }
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
    this.preview = '';
    this.droppedImage = null;
    this.droppedVideo = null;
    this.droppedShortVideo = null;
    this.Description = '';
    this.title = '';
    this.tag = '';
  }



  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, type: string) {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0], type);
    }
  }

  onFileSelect(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0], type);
    }
  }

  handleFile(file: File, type: string) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const result = e.target.result;
        if (typeof result === 'string') {
          if (type === 'video') {
            const byteCharacters = atob(result.split(',')[1]);
            const byteArrays = [];
            for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
              const slice = byteCharacters.slice(offset, offset + 1024);
              const byteNumbers = new Array(slice.length);
              for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
              }
              byteArrays.push(new Uint8Array(byteNumbers));
            }
            const blob = new Blob(byteArrays, { type: 'video/mp4' }); // Adjust MIME type as needed
            const videoUrl = URL.createObjectURL(blob);
            this.droppedVideo = file;
            this.preview = videoUrl;

          }
          else if (type === 'image') {
            this.droppedImage = file;
            this.preview = URL.createObjectURL(this.droppedImage)
          }
          else if (type === 'shortVideo') {
            this.droppedShortVideo = file;
            this.preview = URL.createObjectURL(this.droppedShortVideo)
          }
        } else {
          console.error("Expected a string result, but received an ArrayBuffer.");
        }
      }
    };
    reader.readAsDataURL(file);
  }

  // adding new posts  

  transformToVideoFormat(item: any, type: 'video' | 'image' | 'article'): any {
    const createImageSrc = (imageData: string): string => {

      if (imageData.startsWith('data:image')) {
        return imageData;
      } else if (imageData.startsWith('http')) {
        return imageData;
      } else {
        return `data:image/jpeg;base64,${imageData}`;
      }
    };

    let mappedComments: any[] = [];

    try {
      mappedComments = Array.isArray(item.videoCommentContent) ?
        item.videoCommentContent.map((comment: any) => ({
          id: comment.id,
          content: comment.videoCommentContent || '',
          author: comment.user?.name || 'Unknown Author',
          createdAt: new Date(comment.createdAt).toISOString(),  // Ensure correct date format
        })) :
        [];
    } catch (error) {
      console.error('Error mapping comments:', error);
    }
    const profileImage: SafeUrl = this.sanitizeImage(item.user?.userImage || 'https://imgs.search.brave.com/4KZYIoORrEk3lsmtCvb5Vd6IcIfyGmibtiB0H6ZZo-o/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA4LzExLzU0LzMz/LzM2MF9GXzgxMTU0/MzMzMF9LZk5ZdWtw/RFVRZG1YSUt6Y005/Z2tLOU12dHdPTzhC/ai5qcGc');

          // Extract the src logic
      let src;
      if (type === 'image') {
          src = createImageSrc(item.photo);
      } else if (type === 'video') {
          src = item.s3Url;
      } else {
          src = '';
      }

      // Extract the likes logic
      let likes;
      if (type === 'article') {
          likes = item.articleLikeCount || 0;
      } else if (type === 'image') {
          likes = item.imageLikeCount || 0;
      } else if (type === 'video' || type === 'longVideo') {
          likes = item.longVideoLikes || 0;
      } else {
          likes = 0;
      }

      // Extract the shares logic
      let shares;
      if (type === 'article') {
          shares = item.articleShareCount || 0;
      } else if (type === 'image') {
          shares = item.imageShareCount || 0;
      } else if (type === 'video') {
          shares = item.longVideoShares || 0;
      } else if (type === 'longVideo') {
          shares = item.shortVideoShares || 0;
      } else {
          shares = 0;
      }

      // Extract the content logic
      let content;
      if (type === 'article') {
          content = item.article || '';
      } else if (type === 'image') {
          content = item.imageDescription || '';
      } else {
          content = item.longVideoDescription || '';
      }

      return {
          id: item.id,
          type,
          url: '',
          description: item.description || '',
          title: item.title || '',
          isVideo: type === 'video',
          isImage: type === 'image',
          isArticle: type === 'article',
          src,
          likes,
          shares,
          timestamp: item.postDate,
          createdAt: item.createdAt,
          commentDate: item.commentDate,
          comments: mappedComments,
          showComments: false,
          liked: false,
          showShareMenu: false,
          views: type === 'video' ? item.longVideoViews || 0 : 0,
          saved: false,
          userId: item.user?.id || 0,
          tag: item.tag,
          profileImage,
          profileName: item.user?.name || 'Unknown User',
          content,
          showFullContent: false,
          showShareModal: false,
          videoCommentContent: item.videoCommentContent || [],
          text: item.text || [],
          shortVideoLikes: item.longVideoLikes || 0,
          shortVideoShares: item.longVideoShares || 0,
          shortVideoViews: item.shortVideoViews || 0
      };

  }

  sanitizeImage(imageData: string | undefined | null): SafeUrl {
    if (imageData == null || imageData == undefined) {
      return this.sanitizer.bypassSecurityTrustUrl('../../assets/download.png');
    }
    else if (imageData.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(imageData);
    } else if (imageData.startsWith('http')) {
      return this.sanitizer.bypassSecurityTrustUrl(imageData);
    } else {
      // Assuming imageData is base64 encoded JPEG
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${imageData}`);
    }
  }

  uploadShortVideo(): void {
    this.isuploading = true;
    const videoElement = document.createElement('video');
    videoElement.src = URL.createObjectURL(this.droppedShortVideo ? this.droppedShortVideo : new Blob());

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;

      // Example criteria for shorts:
      const maxDuration = 120; // seconds
      const maxWidth = 1080; // pixels
      const maxHeight = 1920; // pixels

      if (duration <= maxDuration && width <= maxWidth && height <= maxHeight) {
        console.log('Uploading short video:');
        this.errorMessage = ''; // Clear any previous error message
        this.fusionService2.uploadShortVideo(this.userId, this.droppedShortVideo, this.Description, this.tag, this.title).subscribe(
          {next:response => {
            console.log('Short video uploaded successfully', response);
            const newShortVideo = this.transformToVideoFormat(response, 'video');
            this.shorts.unshift(newShortVideo);
            alert('Short Video uploaded successfully.');
            this.isuploading = false;
            this.fusionService2.categrisedata(this.userId, this.Description, this.tag, response.id, 'Short_Video').subscribe({next:(res) => { console.log(res) }, error:(error) => { console.log(error) }});
            this.togglePopup()
          },
          error:(error) => {
            if (error.status !== 200) {
              console.error('Error uploading short video', error);
              this.errorMessage = 'Error uploading short video. Please try again.';
              this.togglePopup()
            } else {
              // If status is 200, treat it as a success
              console.log('Short video uploaded successfully');
              alert('Short Video uploaded successfully.');
              this.togglePopup()

              const newShortVideo = this.transformToVideoFormat(error.error, 'video');
              this.shorts.unshift(newShortVideo);

              alert("Something Went Wrong!")
              this.isuploading = false;

              // this.togglePopup()
            }
          }}
        );
      } else {
        this.errorMessage = 'Video does not meet the criteria for shorts. Please ensure your video is no longer than 120 seconds and has a max resolution of 1080x1920. Or Upload in Video Section';
      }
    };

    videoElement.onerror = () => {
      this.errorMessage = 'Error loading video metadata. Please try again with a different video.';
    };
  }

  createArticlePost(): void {
    this.isuploading = true;
    if (this.Description) {
      this.fusionService2.createArticlePost(this.userId, this.Description).subscribe(
        {next:response => {
          console.log('Article post created successfully', response);
          alert("Article uploaded successfully")
          this.isuploading = false;

          this.fusionService2.categrisedata(this.userId, this.Description, this.tag, response.id, 'article').subscribe({next:(res) => { console.log(res) }, error:(error) => { console.log(error) }});
          this.togglePopup()
          // Handle successful article post creation
        },
        error:(error) => {
          console.error('Error creating article post', error);
          alert("Something Went Wrong!")
          this.isuploading = false;
          this.togglePopup()
        }}
      );
    }
  }

  uploadImage(): void {
    this.isuploading = true;
    this.fusionService2.createImagePost(this.userId, this.droppedImage, this.Description, this.tag).subscribe(
      {next:response => {
        console.log('Image post created successfully', response);
        alert("Image uploaded successfully")
        this.isuploading = false;
        this.fusionService2.categrisedata(this.userId, this.Description, this.tag, response.id, 'Image').subscribe({next:(res) => { console.log(res) }, error:(error) => { console.log(error) }});
        this.togglePopup();
      },
      error:error => {
        console.error('Error creating image post', error);
        alert("Something Went Wrong!")
        this.isuploading = false;
        this.togglePopup()

        // Handle error
      }}
    );
  }

  uploadVideo(): void {
    this.isuploading = true;
    this.fusionService2.uploadLongVideo(this.userId, this.droppedVideo, this.Description, this.tag, this.title).subscribe({
      next: (response) => {
        console.log('Video upload completed', response);
        alert("Video uploaded successfully")
        this.isuploading = false;
        this.fusionService2.categrisedata(this.userId, this.Description, this.tag, response.id, 'Video').subscribe({next:(res) => { console.log(res) }, error:(error) => { console.log(error) }});
        this.togglePopup()
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error during video upload', error);

        alert("Something went wrong please try again")
        this.isuploading = false;
        this.togglePopup()
      }
    });
  }

  AddPost() {

    console.log(this.Description)
    switch (this.selectedOption) {
      case 'article':
        if (this.Description != '') {
          this.createArticlePost();
        }
        else {
          alert("Please write something")
        }
        break;
      case 'image':
        if (this.Description != '' && this.tag.length > 1 && this.droppedImage) {
          this.uploadImage();
        }
        else {
          alert("Please write something")
        }
        break;
      case 'video':
        if (this.Description != '' && this.tag.length > 1 && this.droppedVideo && this.title.length > 1) {
          this.uploadVideo();
        }
        else {
          alert("Please write something")
        }
        break;
      case 'shortVideo':
        if (this.Description.length > 1 && this.tag.length > 1 && this.droppedShortVideo && this.title.length > 1) {
          this.uploadShortVideo();
        }
        else {
          alert("Please write something")
        }
        break;
      default:

        break;
    }
  }

  @ViewChild('videoEl', { static: false }) videoEl!: ElementRef;

  incrementView(post: any, video: HTMLVideoElement) {
    if (!post.viewed) {
      post.views = (post.views || 0) + 1;
      post.viewed = true; // Prevent multiple increments
    }
  }


  checkLikeStatus(post: Post): Observable<boolean> {
    const userId = this.userId;
    let endpoint = '';

    if (this.isArticle(post)) {
      endpoint = `${this.apiBaseUrl}/api/articleposts/${post.id}/liked-by/${userId}`;
    } else if (this.isImagePost(post)) {
      endpoint = `${this.apiBaseUrl}/api/imagePosts/${post.id}/liked-by/${userId}`;
    } else if (this.isShortVideo(post)) {
      endpoint = `${this.apiBaseUrl}/short-video/is-liked/${post.id}/${userId}`;
    } else if (this.isLongVideo(post)) {
      endpoint = `${this.apiBaseUrl}/long-video/is-liked/${post.id}/${userId}`;
    }

    if (!endpoint) {
      return of(false);
    }

    return this.http.get<boolean>(endpoint).pipe(
      mergeMap(isLiked => {
        post.isLiked = isLiked;
        return of(isLiked);
      })
    );
  }

  toggleLike(post: Post): void {
    const userId = this.userId;
    let endpoint = '';

    if (this.isArticle(post)) {
      endpoint = `${this.apiBaseUrl}/api/articleposts/${post.id}/like?userId=${userId}`;
    } else if (this.isImagePost(post)) {
      endpoint = `${this.apiBaseUrl}/api/imagePosts/${post.id}/like?userId=${userId}`;
    } else if (this.isShortVideo(post)) {
      endpoint = `${this.apiBaseUrl}/short-video/${post.id}/like?userId=${userId}`;
    } else if (this.isLongVideo(post)) {
      endpoint = `${this.apiBaseUrl}/long-video/${post.id}/like?userId=${userId}`;
    }

    if (endpoint) {
      post.isLiked = !post.isLiked;
      if (post.isLiked) {
        this.incrementLikes(post);
      } else {
        this.decrementLikes(post);
      }
      this.http.post(endpoint, {}).subscribe({
        next: () => {
          // Toggle like state and update count

        },
        error: (error) => {
          post.isLiked = !post.isLiked;
          this.decrementLikes(post);
          console.error('Error toggling like:', error);
        }
      });
    }
  }

  private incrementLikes(post: Post): void {
    if (this.isShortVideo(post)) {
      post.shortVideoLikes++;
    } else if (this.isLongVideo(post)) {
      post.longVideoLikes++;
    } else if (this.isArticle(post)) {
      post.articleLikeCount++;
    } else if (this.isImagePost(post)) {
      post.imageLikeCount++;
    }
  }

  private decrementLikes(post: Post): void {
    if (this.isShortVideo(post)) {
      post.shortVideoLikes--;
    } else if (this.isLongVideo(post)) {
      post.longVideoLikes--;
    } else if (this.isArticle(post)) {
      post.articleLikeCount--;
    } else if (this.isImagePost(post)) {
      post.imageLikeCount--;
    }
  }

  // Update the HTML template reference to use post.isLiked
  isPostLiked(post: Post): boolean {
    return post.isLiked || false;
  }
  batchSize: number = 5;
  currentBatch: number = 0;
  isProcessingBatch: boolean = false;
  allPosts: Post[] = [];

  fetchPosts(): void {
    this.userId = Number(localStorage.getItem("id"));
    this.http.get<Post[]>(`${this.apiBaseUrlAI}/edu_feed/${this.userId}`)
      .subscribe({
        next: (response) => {
          this.allPosts = response;
          this.processBatch();
        },
        error: (error) => {
          console.error('Error fetching posts:', error);
          this.isloaded = true;
        }
      });
  }

  private processBatch(): void {
    if (this.isProcessingBatch) return;

    this.isProcessingBatch = true;
    const start = this.currentBatch * this.batchSize;
    const end = Math.min(start + this.batchSize, this.allPosts.length);
    const currentBatchPosts = this.allPosts.slice(start, end);

    if (currentBatchPosts.length === 0) {
      this.isloaded = true;
      this.isProcessingBatch = false;
      return;
    }

    const likeChecks = currentBatchPosts.map(post => this.checkLikeStatus(post));

    forkJoin(likeChecks).subscribe({
      next: () => {
        // Add processed posts to the visible posts array
        this.posts = [...this.posts, ...currentBatchPosts];
        this.currentBatch++;
        this.isProcessingBatch = false;
    
        // Set isloaded to true (removes redundant if condition)
        this.isloaded = true;
      },
      error: (error) => {
        console.error('Error checking like statuses for batch:', error);
        this.isProcessingBatch = false;
        this.isloaded = true;
      }
    });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Handle existing video pause logic
    if (this.videoEl) {
      const rect = this.videoEl.nativeElement.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        this.videoEl.nativeElement.pause();
      }
    }

    // Check if we're near the bottom and should load more posts
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
      this.processBatch();
    }
  }

  selectedPost: any = null;
  comments: any[] = [];
  newComment: string = '';
  apiUrl = 'http://localhost:8080/posts';
  commentsloading: boolean = false;

  viewComments(post: any) {
    this.selectedPost = post;
    this.commentsloading = true;
    console.log("loading")
    this.http.get<any[]>(this.getCommentsapi(this.selectedPost))
      .subscribe(
        {next:(data) => {
          console.log(data)
          this.selectedPost.comments = data;
          this.comments = data;
          this.checkLikedStatus(); // Check like status for each comment after fetching
          this.commentsloading = false;
        },
        error:(error) => {
          console.error('Error fetching comments:', error)
          this.commentsloading = false;
        }}
      );

  }

  selectPost(post: any) {
    this.selectedPost = post;
  }

  closeComments() {
    this.selectedPost = null;
    this.comments = [];
  }

  addComment() {
    const params = new URLSearchParams();
    params.append('content', this.newComment);


    this.http.post<Comment>(
      this.postCommentsapi(this.selectedPost), {}
    ).subscribe(
      {next:(comment) => {
        console.log(comment)
        this.viewComments(this.selectedPost) // Clear input after submission
        this.comments.push(comment);
        this.newComment = '';
      },
      error:(error) => console.error('Error adding comment:', error)
    });
  }

  checkLikedStatus() {
    this.comments.forEach((comment) => {
      console.log(comment)
      this.isCommentLiked(comment.id);
    });
  }

  // Check if a comment is liked by the user
  isCommentLiked(commentId: number) {
    const url = `http://localhost:8080/api/comments/comment/${commentId}/likes?userId=${this.userId}`;

    this.http.get<any>(url).subscribe(
      {next:(isLiked) => {
        this.likedComments[commentId] = isLiked.likedUserIds.includes(this.userId);
        console.log(isLiked);
      },
      error:(error) => {
        console.error(`Error checking like status for comment ${commentId}:`, error);
      }}
    );
  }

  // Toggle like/unlike for a comment
  toggleLike2(commentId: number) {
    const url = `http://localhost:8080/api/comments/comment/${commentId}/${this.userId}/like`;
    
    this.likedComments[commentId] = !this.likedComments[commentId]

      this.http.post(url, {}).subscribe(
        {next:() => { 
          console.log("done"
          )
        },
        error:(error) =>{ 
          console.error(`Error liking comment ${commentId}:`, error);
          this.likedComments[commentId] = !this.likedComments[commentId];
        }}
      );
  }

  getCommentsapi(post: Post): string {
    let endpoint = '';

    if (this.isArticle(post)) {
      endpoint = `${this.apiBaseUrl}/api/comments/articlepost/${post.id}`;
    } else if (this.isImagePost(post)) {
      endpoint = `${this.apiBaseUrl}/api/comments/imagepost/${post.id}`;
    } else if (this.isShortVideo(post)) {
      endpoint = `${this.apiBaseUrl}/short-video/${post.id}/comments`;
    } else if (this.isLongVideo(post)) {
      endpoint = `${this.apiBaseUrl}/long-video/${post.id}/comments`;
    }

    if (!endpoint) {
      return '';
    }

    return endpoint;
  }

  postCommentsapi(post: Post): string {
    const userId = this.userId;
    let endpoint = '';

    if (this.isArticle(post)) {
      endpoint = `${this.apiBaseUrl}/api/comments/articlepost/${post.id}/add?userId=${userId}&text=${this.newComment}`;
    } else if (this.isImagePost(post)) {
      endpoint = `${this.apiBaseUrl}/api/comments/imagepost/${post.id}/add?userId=${userId}&text=${this.newComment}`;
    } else if (this.isShortVideo(post)) {
      endpoint = `${this.apiBaseUrl}/short-video/${post.id}/comment/${userId}?content=${this.newComment}`;
    } else if (this.isLongVideo(post)) {
      endpoint = `${this.apiBaseUrl}/long-video/${post.id}/comment/${userId}?content=${this.newComment}`;
    }

    if (!endpoint) {
      return '';
    }

    return endpoint;
  }
}

