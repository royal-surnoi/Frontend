
import { Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject, Subscription, Observable, of, interval } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FusionService } from '../fusion.service';
import { SubauthService } from '../subauth.service';
import { NotificationService } from '../notification.service';
import { UserNotification } from '../notification.model';
import { NotificationComponent } from "../notification/notification.component";

 
interface User {
  id: number;
  name: string;
  email: string;
  profession: string;
  userImage?: string | SafeUrl;  // Can be either a base64 string or a SafeUrl
}
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NotificationComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userImage: SafeUrl | null = null;
  name: string | null = '';
  isLoggedIn: boolean = false;
  private subscriptions: Subscription = new Subscription();
  private pollingSubscription!: Subscription;

  query: string = '';
 
  selectedView: string = 'As a user';
  showEducationDropdown = false;
  dropdownOpen = false;
  isMentorLoggedIn: boolean = false;
  isEnrolled: boolean = false;
  showDashboard: boolean = false;
  showUserOption: boolean = false;
  showUserViewDropdown: boolean = false;
  blink: boolean = false; // Add blink property
   showAsUserOption: boolean = true;
   showjobOption: boolean = false;
showNotifications: any;
notifications: any;
isNotificationOpen: boolean = false;
  unreadCount: any;
  unreadMessageCount: number = 0;
  private subscription!: Subscription;
  private userId!: number | null;


  
 
  users: User[] = [];
  filteredUsers: User[] = [];
  private searchTerms = new Subject<string>();
  isLoading: boolean = false;
  showSuggestions: boolean = false;
 
  private notificationSound!: HTMLAudioElement;
  private previousUnreadCount: number = 0;

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!event.target.closest('.search-bar')) {
      this.showSuggestions = false;
    }
  }
 
 
 
 
  constructor(
    private router: Router,
    public authService: AuthService,
    private subauthService: SubauthService,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private fusionService: FusionService,
    private notificationService:NotificationService,
    private http: HttpClient
  ) {
    this.isLoggedIn = this.authService.isLogged();
    this.notificationSound = new Audio('assets/messagetone.mp3');

  }
 
  ngOnInit(): void {
    this.userId = this.authService.getId()
    ? parseInt(this.authService.getId()!, 10)
    : null;
  
   this.fetchUserDetails();
    this.subscriptions.add(
      this.authService.getNameObservable().subscribe(name => {
        this.name = name;
      })
    );
    this.subscriptions.add(
      this.authService.getLoggedInObservable().subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
      })
    );
    this.isMentorLoggedIn = localStorage.getItem('mentorLoggedIn') === 'true';
    this.isLoggedIn = this.authService.isLogged();
 
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.isLoading = true;
      }),
      switchMap((term: string) => this.searchUsers(term)),
      tap(() => this.isLoading = false)
    ).subscribe(
      {next:users => {
        console.log('Filtered users:', users);
        this.filteredUsers = users;
        this.showSuggestions = true;
      },
      error:error => {
        console.error('Error in search:', error);
        this.isLoading = false;
        this.showSuggestions = false;
      }}
    );
 
    this.getAllUsers();
  }
 
  playNotificationSound(): void {
    this.notificationSound.play().catch(error => {
      console.error('Error playing notification sound:', error);
    });
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
  refreshUnreadCount() {
    if (this.userId !== null) {
      this.notificationService.refreshUnreadCount(this.userId);
    }
  }
 
  navigateToLogin() {
    this.router.navigate(['login']);
  }
 
  logout(): void {
    if (this.selectedView === 'As a mentor' && localStorage.getItem('mentorLoggedIn') === 'true') {
      this.logoutMentor();
    } else {
      localStorage.removeItem("adminId");
      localStorage.removeItem('recruiterId');
      localStorage.removeItem('JobRecruiterToken');
      localStorage.removeItem('JobAdminToken');
      this.logoutMainUser();
    }
  }
 
  private logoutMentor(): void {
    this.subauthService.logout();
    this.selectedView = 'As a user';
    this.router.navigate(['/sublogin']);
  }
 
  private startPollingForUnreadMessages(): void {
    this.pollingSubscription = interval(100).pipe(
      switchMap(() => this.notificationService.getUnreadCount(this.userId))
    ).subscribe(count => {
      if (this.unreadMessageCount !== count) {
        this.unreadMessageCount = count;
      }
    });
  }

  
  private logoutMainUser(): void {
    this.authService.logout();
    this.subauthService.logout();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
   
 
  goToProfile(): void {
    const id = this.authService.getId();
    if (id) {
      this.router.navigate([`/profile/${id}`]);
    } else {
      console.error('User ID not found. Unable to navigate to profile.');
    }
  }
  goTosettings(){
    this.router.navigate([`/profile-sett`]);
  }
 
  fetchUserDetails(): void {
    const userId = localStorage.getItem('id');
    if (userId) {
      this.fusionService.getUserById(userId).subscribe({
        next: (data) => {
          if (data.userImage) {
            this.userImage = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${data.userImage}`);
          }
        },
        error: (error) => {
          console.error('Error fetching user details:', error);
        }
      });
    } else {
      console.error('User ID not found in local storage');
    }
  }
 
  toggleEducationDropdown(): void {
    this.showEducationDropdown = !this.showEducationDropdown;
    this.showUserOption = this.showEducationDropdown;
    this.showUserViewDropdown = false;
    if (!this.showEducationDropdown) {
      this.dropdownOpen = false;
    }
  }
 
  toggleUserViewDropdown(): void {
    this.showUserViewDropdown = !this.showUserViewDropdown;
    this.dropdownOpen = this.showUserViewDropdown;
  }
 
  hideUserOption(): void {
    this.showUserOption = false;
    this.showUserViewDropdown = false;
    this.dropdownOpen = false;
  }
 
  hideUserViewDropdown(): void {
    this.showUserViewDropdown = false;
    this.dropdownOpen = false;
  }
 
  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }
 
  toggleAsUserOption(): void {
    if(this.isLoggedIn)
   { this.selectedView = 'As a user';
    this.showAsUserOption = true;
    this.showjobOption = false;}
  }

  toggleJobOption(): void{
    this.selectedView='As a Admin'
    this.showjobOption = true;
    this.showAsUserOption = false;
  }
 
  hideAsUserOption(): void {
    this.showAsUserOption = false;
    this.showjobOption = false;
  }
 
  onSelectView(view: string): void {
    this.selectedView = view;
    this.blink = true;
 
    if (view === 'As a mentor') {
      const mentorLoggedIn = localStorage.getItem('mentorLoggedIn') === 'true';
      if (mentorLoggedIn) {
        this.router.navigate(['/mentorperspective']);
      } else {
        this.router.navigate(['/sublogin']);
      }
    } 

    else if(view == 'As a Admin'){
      if(localStorage.getItem("adminId")==""||localStorage.getItem("adminId")==undefined){
        this.router.navigate(['/JobAdminLogin']);
      }
      else{
        this.router.navigate(['/JobAdmin']);
      }
    }

    else if(view == 'As a recruiter'){
      if(localStorage.getItem("recruiterId")==""||localStorage.getItem("recruiterId")==undefined){
        this.router.navigate(['/JobRecruiterLogin']);
      }
      else{
        this.router.navigate(['/JobRecruiter']);
      }
    }
    else {
      this.checkUserEnrollment();
    } 
  }
 
  private checkUserEnrollment(): void {
    const userIdString = this.authService.getId();
    const userId = userIdString ? parseInt(userIdString, 10) : null;
    alert("checking userId "+userId );
    
    if (userId) {
      this.fusionService.isEnrolledInAnyCourse(userId).subscribe(
        {next:(response: boolean) => {
          this.isEnrolled = response;
          this.showDashboard = response;
          if (response) {
            this.router.navigate(['/studentdashboard']);
          } else {
            alert('You are not enrolled in any course.');
          }
        },
        error:(error) => {
          console.error('Error checking enrollment status:', error);
          alert('Failed to check enrollment status. Please try again later.');
        }}
      );
    } else {
      console.error('User ID not available.');
      alert('User ID not available. Please log in again.');
    }
  }
 
  goToDashboard(): void {
    this.checkUserEnrollment();
  }

navigateToNotifications(): void {
    if (this.isLoggedIn) {
      this.router.navigate(['/notification']);
    }
  }

 toggleNotifications(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
  }
  loadNotifications(): void {
    const userId = this.authService.getId();
    if (userId) {
      this.notificationService.getNotificationsByUser(Number(userId)).subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.unreadCount = notifications.length; // Assuming all fetched notifications are unread
        },
        error: (error) => console.error('Error fetching notifications:', error)
      });
    }
  }
 
  markAsRead(notification: UserNotification): void {
    this.unreadCount = Math.max(0, this.unreadCount - 1);
  }
 
 

 
  search(term: string): void {
    console.log('Search term:', term);
    if (term.trim() === '') {
      this.showSuggestions = false;
      this.filteredUsers = [];
    } else {
      this.searchTerms.next(term);
      this.showSuggestions = true;
    }
  }
 
  private searchUsers(term: string): Observable<User[]> {
    console.log('Searching users with term:', term);
    
    return of(this.users).pipe(
      map(users => users.filter(user => {
        if (!user || !user.name) return false;
        const nameMatch = user.name.toLowerCase().includes(term.toLowerCase());
        const professionMatch = user.profession && user.profession.toLowerCase().includes(term.toLowerCase());
        return nameMatch || professionMatch;
       
      })),
      tap(filteredUsers => {
        console.log('Filtered users:', filteredUsers);
        filteredUsers.forEach(user => this.fetchUserImage(user));
      })
    );
  }


  private fetchUserImage(user: User): void {
    if (!user.userImage) {
      this.fusionService.getUserById(user.id.toString()).subscribe({
        next: (data) => {
          if (data.userImage) {
            user.userImage = data.userImage;
            this.cdr.detectChanges();  // Trigger change detection
          }
        },
        error: (error) => {
          console.error(`Error fetching image for user ${user.id}:`, error);
        }
      });
    }
  }

getSafeImageUrl(imageData: string | SafeUrl | undefined): SafeUrl {
  if (typeof imageData === 'string') {
    return this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${imageData}`);
  } else if (imageData && typeof imageData === 'object' && 'changingThisBreaksApplicationSecurity' in imageData) {
    // This is a SafeUrl object
    return imageData;
  }
  return this.sanitizer.bypassSecurityTrustUrl('../../assets/download.png');
}

  private getAllUsers(): void {
    console.log('Fetching all users');
    this.isLoading = true;
    this.http.get<User[]>('http://localhost:8080/user/all').subscribe(
      {next:users => {
        console.log('Fetched users:', users);
        this.users = users.filter(user => user && user.id && user.name );
        console.log('Valid users:', this.users);
        this.isLoading = false;
      },
      error:error => {
        console.error('Error fetching users:', error);
        this.isLoading = false;
      }}
    );
  }
  onUserSelect(user: User): void {
    console.log('Selected user:', user);
    this.query = user.name;
    this.showSuggestions = false;
    const currentRoute = this.router.url; // Get full URL path
    console.log('Current Route:', currentRoute);
    if( this.router.url.split('/')[1]=="usersprofile"){
      this.router.navigate(['/usersprofile', user.id]).then(() => {
        window.location.reload();
      });
    }
    else{
      this.router.navigate(['/usersprofile', user.id])
    }
  }
}
 
