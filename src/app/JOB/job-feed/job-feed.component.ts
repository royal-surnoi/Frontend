import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { DomSanitizer,SafeUrl } from '@angular/platform-browser';


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
}

interface Article extends BasePost {
  content_type?: 'article_post';
  article: string;
  articleLikeCount: number;
  articleDislikes: number;
  articleShareCount: number;
}

interface ImagePost extends BasePost {
  photo: string;
  imageDescription: string;
  imageLikeCount: number;
  imageDislikes: number;
  imageShareCount: number;
}

type Post = ShortVideo | LongVideo | Article | ImagePost;


@Component({
  selector: 'app-job-feed',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './job-feed.component.html',
  styleUrl: './job-feed.component.css'
})
export class JobFeedComponent {
  posts: Post[] = [];
  userId!:number;
  isloaded:boolean = false;
  private apiBaseUrlAI = environment.apiBaseUrlAI;

  constructor(private http: HttpClient,private sanitizer:DomSanitizer) {}

  ngOnInit(): void {
    
    this.fetchPosts();
  }
  
  fetchPosts(): void {
    this.userId = Number(localStorage.getItem("id"));
    this.http.get<Post[]>(`${this.apiBaseUrlAI}/job_feed/${this.userId}`)
      .subscribe({
        next: (response) => {
          this.posts = response;
          console.log('Posts loaded:', this.posts);
          this.isloaded = true;
        },
        error: (error) => {
          console.error('Error fetching posts:', error);
        }
      });
  }

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

  getimage(userImage:any):string|SafeUrl{
    const sanitizedUrl = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${userImage}`);
    return sanitizedUrl;
  }
}
