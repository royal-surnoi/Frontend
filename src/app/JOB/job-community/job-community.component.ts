 
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpParams } from '@angular/common/http';
import { interval, Observable, Subscription, of, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
 
interface Admin {
  id: number;
  name: string;
}
 
interface Community {
  similarity_score: any;
  id: number;
  name: string;
  admin: {
    id: number;
    name: string;
  };
  members: string[];
  description: string | null;
  image?: string;
}
 
interface RecommendedCommunity extends Community {
  similarity_score: number;
}
 
interface RecommendationResponse {
  recommended_communities: RecommendedCommunity[];
}
 
interface Message {
  id: number;
  messageContent: string;
  sender: {
    id: number;
    name: string;
    userImage?: string;
  } | null;
  fileUrl: string | null;
  reactions: string[];
  createdAt: string;
  community?: Community;
}
 
interface MessageData {
  messageContent: string;
  senderId: number;
}
 
interface MessageRequest {
  messageContent: string;
  sender: {
    id: number;
    name: string;
  };
  communityId: number;
}
 
interface Member {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
}
 
@Component({
  selector: 'app-job-community',
  standalone: true,
  imports: [ CommonModule,FormsModule,ToastModule,ButtonModule],
  templateUrl: './job-community.component.html',
  styleUrl: './job-community.component.css',
  providers: [MessageService,  
  // Updated for HttpClient
 
  ]
})
export class JobCommunityComponent implements OnInit, OnDestroy {
  private apiBaseUrlAI = environment.apiBaseUrlAI;
  userId: number = 1;
  allCommunities: Community[] = [];
  joinedCommunities: Community[] = [];
  availableCommunities: Community[] = [];
  selectedCommunityId: number | null = null;
  activeTab: 'messages' | 'members' = 'messages';
  selectedCommunity: Community | null = null;
  communityMessages: Message[] = [];
  newMessage = '';
  isLoading: boolean = false;
  error: string | null = null;
  private messagePollingSubscription?: Subscription;
  private readonly POLLING_INTERVAL = 5000; // 5 seconds
  private readonly DEFAULT_IMAGE = 'assets/default-community.png'; // Add a default image to your assets
  showCreateCommunityModal = false;
  newCommunity = {
    name: '',
    description: '',
    image: null as File | null
  };
  showMembersModal = false;
  communityMembers: Member[] = [];
  @ViewChild('messagesContainer') private messagesContainer: ElementRef | undefined;
 
  constructor(private http: HttpClient, private sanitizer: DomSanitizer,private messageService: MessageService) {}
 
  ngOnInit(): void {
    // Initialize communities first
    this.userId = Number(localStorage.getItem('id'));
    this.initializeCommunities();
  }
 
  ngOnDestroy(): void {
    this.stopMessagePolling();
  }
 
  private stopMessagePolling(): void {
    if (this.messagePollingSubscription) {
      this.messagePollingSubscription.unsubscribe();
      this.messagePollingSubscription = undefined;
    }
  }
 
  // Method to fetch all communities
  fetchAllCommunities(): Observable<Community[]> {
 
    // return this.http.post<RecommendationResponse>(
    //   'http://0.0.0.0:8000/recommend_communities/',
    //   { user_id: this.userId },
    //   {
    //     headers,
    //     withCredentials: false // Disable credentials for CORS
    //   }
    // ).pipe(
    //   map(response => {
    //     // Extract communities from the nested response
    //     console.log(response)
    //     return response.recommended_communities.map(rc => ({
    //       id: rc.id,
    //       name: rc.name,
    //       description: rc.description,
    //       admin: rc.admin || { id: 0, name: '' }, // Provide default admin if missing
    //       members: rc.members || [],
    //       image: rc.image,
    //       similarity_score: rc.similarity_score
    //     }));
    //   }),
    //   catchError(error => {
    //     console.error('Error fetching recommended communities:', error);
    //     if (error.status === 0) {
    //       console.error('CORS or Network Error. Please ensure the server is running and CORS is enabled.');
    //     }
    //     // Fallback to local endpoint if recommendation service fails
    //     return this.http.get<Community[]>('http://localhost:8080/api/GetALlCommunity').pipe(
    //       catchError(fallbackError => {
    //         console.error('Fallback API also failed:', fallbackError);
    //         return of([]); // Return empty array if both APIs fail
    //       })
    //     );
    //   })
    // );
 
   
 
    return this.http.post<Community[]>(`${this.apiBaseUrlAI}/recommend_communities`,{ user_id: this.userId }).pipe(
      catchError(fallbackError => {
        console.error('Fallback API also failed:', fallbackError);
        return of([]); // Return empty array if both APIs fail
      })
    );
  }
 
  // Method to fetch user's joined communities
  fetchJoinedCommunities(): Observable<Community[]> {
    return this.http.get<Community[]>(`http://localhost:8080/api/Community/user/${this.userId}`).pipe(
      catchError(error => {
        console.error('Error fetching joined communities:', error);
        throw error;
      })
    );
  }
 
  // Method to initialize communities
  initializeCommunities(): void {
    this.isLoading = true; // Add loading state
    // Fetch all communities first
    this.fetchAllCommunities().subscribe({
      next: (communities) => {
        this.allCommunities = communities;
        // Then fetch joined communities
        this.fetchJoinedCommunities().subscribe({
          next: (joinedCommunities) => {
            this.joinedCommunities = joinedCommunities;
            this.updateAvailableCommunities();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error fetching joined communities:', error);
            this.isLoading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error fetching all communities:', error);
        this.isLoading = false;
      }
    });
  }
 
  // Method to update available communities
  updateAvailableCommunities(): void {
    // Filter out communities that the user has already joined
    this.availableCommunities = this.allCommunities.filter(community =>
      !this.joinedCommunities.some(joined => joined.id === community.id)
    );
  }
 
  getSafeImageUrl(imageUrl: string | undefined | null): SafeUrl {
    if (!imageUrl) {
      return this.getDefaultUserImage();
    }
   
    // Check if it's already a base64 image
    if (imageUrl.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
    }
   
    // If it's a regular URL, convert it to base64
    return this.sanitizer.bypassSecurityTrustUrl("data:image/png;base64,"+imageUrl);
  }
 
  getDefaultUserImage(): SafeUrl {
    // Default base64 user image - you can replace this with your own default image
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlciI+PHBhdGggZD0iTTIwIDIxdi0yYTQgNCAwIDAgMC00LTRIOGE0IDQgMCAwIDAtNCA0djIiPjwvcGF0aD48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjwvc3ZnPg==';
    return this.sanitizer.bypassSecurityTrustUrl(defaultImage);
  }
 
  getDefaultGroupImage(): SafeUrl {
    // Default base64 group image - you can replace this with your own default image
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJmZWF0aGVyIGZlYXRoZXItdXNlcnMiPjxwYXRoIGQ9Ik0xNyAyMXYtMmE0IDQgMCAwIDAtNC00SDVhNCA0IDAgMCAwLTQgNHYyIj48L3BhdGg+PGNpcmNsZSBjeD0iOSIgY3k9IjciIHI9IjQiPjwvY2lyY2xlPjxwYXRoIGQ9Ik0yMyAyMXYtMmE0IDQgMCAwIDAtMy0zLjg3Ij48L3BhdGg+PHBhdGggZD0iTTE2IDMuMTNhNCA0IDAgMCAxIDAgNy43NSI+PC9wYXRoPjwvc3ZnPg==';
    return this.sanitizer.bypassSecurityTrustUrl(defaultImage);
  }
 
  getSafeCommunityImage(community: Community | null): SafeUrl {
    if (!community || !community.image) {
      return this.getDefaultGroupImage();
    }
    return this.getSafeImageUrl(community.image);
  }
 
  private scrollToBottom(): void {
    try {
      const container = this.messagesContainer?.nativeElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }
 
  sendMessage(): void {
    if (!this.selectedCommunityId || !this.newMessage?.trim() || !this.userId) return;
 
    const messageContent = this.newMessage.trim();
    const params = new HttpParams()
      .set('senderId', this.userId.toString())
      .set('messageContent', messageContent);
 
    this.http.post<void>(
      `http://localhost:8080/api/Community/${this.selectedCommunityId}/messages`,
      null,
      { params }
    ).pipe(
      catchError(error => {
        console.error('Error sending message:', error);
        return throwError(() => error);
      })
    ).subscribe(() => {
      this.newMessage = '';
      this.fetchMessages(); // This will trigger scrollToBottom after messages are loaded
    });
  }
 
  selectCommunity(communityId: number): void {
    // Stop existing polling if any
    this.stopMessagePolling();
 
    this.selectedCommunityId = communityId;
    this.activeTab = 'messages';
    this.selectedCommunity = this.joinedCommunities.find(c => c.id === communityId) || null;
    this.communityMembers = []; // Clear previous members
   
    if (this.selectedCommunity) {
      // Fetch messages immediately
      this.fetchMessages();
      // Start polling for new messages
      this.startMessagePolling();
    }
  }
 
  unselectCommunity(): void {
    this.stopMessagePolling();
    this.selectedCommunityId = null;
    this.selectedCommunity = null;
    this.activeTab = 'messages';
    this.communityMessages = [];
    this.communityMembers = []; // Clear members when unselecting
  }
 
  // Update fetchMessages to handle errors better
  fetchMessages(): void {
    if (!this.selectedCommunityId) return;
 
    this.http.get<Message[]>(`http://localhost:8080/api/Community/${this.selectedCommunityId}/messages`)
      .pipe(
        catchError(error => {
          console.error('Error fetching messages:', error);
          return of([]);
        })
      )
      .subscribe(messages => {
        this.communityMessages = messages;
        setTimeout(() => this.scrollToBottom(), 100); // Scroll after messages are rendered
      });
  }
 
  isFollowing(communityId: number): boolean {
    return this.joinedCommunities.some(c => c.id === communityId);
  }
 
  isAdmin(communityId: number): boolean {
    const community = this.allCommunities.find(c => c.id === communityId);
    return community?.admin?.id === this.userId;
  }
 
  canUnfollow(communityId: number): boolean {
    return !this.isAdmin(communityId);
  }
 
  followCommunity(communityId: number): Observable<any> {
    const params = new HttpParams().set('userId', this.userId.toString());
    return this.http.post<void>(
      `http://localhost:8080/api/Community/${communityId}/addUser`,
      null,
      { params }
    ).pipe(
      catchError(error => {
        console.error('Error following community:', error);
        return throwError(() => error);
      })
    );
  }
 
  unfollowCommunity(communityId: number): Observable<any> {
    const params = new HttpParams().set('userId', this.userId.toString());
    return this.http.post<void>(
      `http://localhost:8080/api/Community/${communityId}/removeUser`,
      null,
      { params }
    ).pipe(
      catchError(error => {
        console.error('Error unfollowing community:', error);
        return throwError(() => error);
      })
    );
  }
 
 
  toggleFollow(communityId: number): void {
    // Don't allow unfollowing if user is admin
    if (this.isFollowing(communityId)) {
      this.unfollowCommunity(communityId).subscribe({
        next: () => {
          this.initializeCommunities();
        },
        error: (error) => {
          console.error('Error unfollowing community:', error);
        }
      });
    } else {
      this.followCommunity(communityId).subscribe({
        next: () => {
          this.initializeCommunities();
        },
        error: (error) => {
          console.error('Error following community:', error);
        }
      });
    }
  }
 
 
  getCommunityName(communityId: number): string {
    const community = this.allCommunities.find(c => c.id === communityId);
    return community?.name || 'Unknown Community';
  }
 
  getCommunityImage(communityId: number): string {
    const community = this.allCommunities.find(c => c.id === communityId);
    return community?.image || this.DEFAULT_IMAGE;
  }
 
  fetchCommunityMembers(communityId: number): void {
    this.activeTab = 'members';
    this.http.get<Member[]>(`http://localhost:8080/api/Community/${communityId}/members`)
      .pipe(
        catchError(error => {
          console.error('Error fetching community members:', error);
          return of([]);
        })
      )
      .subscribe(members => {
        this.communityMembers = members;
        console.log('Fetched members:', members); // Debug log
      });
  }
 
  switchTab(tab: 'messages' | 'members'): void {
    this.activeTab = tab;
    if (tab === 'members' && this.selectedCommunityId) {
      this.fetchCommunityMembers(this.selectedCommunityId);
    }
  }
 
  closeMembersModal(): void {
    this.showMembersModal = false;
    this.communityMembers = [];
  }
 
  getMessageTime(createdAt: string): string {
    if (!createdAt) return '';
    const date = new Date(createdAt);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
 
  private startMessagePolling(): void {
    this.messagePollingSubscription = interval(this.POLLING_INTERVAL)
      .pipe(
        switchMap(() => {
          if (!this.selectedCommunityId) return of([]);
          return this.http.get<Message[]>(
            `http://localhost:8080/api/Community/${this.selectedCommunityId}/messages`
          ).pipe(
            catchError(error => {
              console.error('Error polling messages:', error);
              return of([]);
            })
          );
        })
      )
      .subscribe({
        next: (messages) => {
          this.communityMessages = messages;
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (error) => {
          console.error('Error in message polling:', error);
        }
      });
  }
 
  openCreateCommunityModal(): void {
    this.showCreateCommunityModal = true;
  }
 
  closeCreateCommunityModal(): void {
    this.showCreateCommunityModal = false;
    this.newCommunity = {
      name: '',
      description: '',
      image: null
    };
  }
 
  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.newCommunity.image = file;
    }
  }
 
  createCommunity(): void {
    if (!this.newCommunity.name.trim() || !this.userId) {
      return;
    }
 
    const formData = new FormData();
    formData.append('name', this.newCommunity.name.trim());
    formData.append('adminId', this.userId.toString());
    formData.append('description', this.newCommunity.description.trim() || '');
   
    if (this.newCommunity.image) {
      formData.append('image', this.newCommunity.image);
    }
 
    this.http.post<Community>(
      'http://localhost:8080/api/Community',
      formData
    ).pipe(
      catchError(error => {
        console.error('Error creating community:', error);
        this.messageService.add({
 
          severity: 'error',
 
          summary: 'Error',
 
          detail: 'Failed to create community. Please try again.'
 
        });
        throw error;
      })
    ).subscribe({
      next: (community) => {
        this.allCommunities = [...this.allCommunities, community];
        this.updateAvailableCommunities();
        this.initializeCommunities();
        this.closeCreateCommunityModal();
        this.messageService.add({
 
          severity: 'success',
 
          summary: 'Success',
 
          detail: 'Community created successfully!'
 
        });
 
      }
    });
  }
}
 
 