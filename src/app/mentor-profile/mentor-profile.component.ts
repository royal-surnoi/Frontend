import { Component } from '@angular/core';
import { ActivatedRoute,Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient,HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, forkJoin, map, mergeMap, Observable, of, shareReplay } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SafeUrl } from '@angular/platform-browser';
import { ProgressBarModule } from 'primeng/progressbar';


interface Course {
  id: number;
  courseTitle: string;
  courseDescription: string;
  courseFee: number;
  courseImage: string;
  courseType: string;
  courseLanguage: string;
  level: string;
  user: {
    name: string;
    id: number;
  };
  coursePercentage: any;
  courseDuration: number;
  currency: string;
  projectProgress: number;
  enroled: boolean;
  rating$: Observable<number>;
  enrollmentCount$: Observable<number>;
  courseTerm: string;
  showData: boolean;
}





@Component({
  selector: 'app-mentor-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ProgressBarModule],
  templateUrl: './mentor-profile.component.html',
  styleUrl: './mentor-profile.component.css'
})
export class MentorProfileComponent {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { };

  userId: any;
  selectedMentor: any;
  courses: Course[] | undefined;
  isLoading: boolean = false;
  filteredCourses$ = new BehaviorSubject<any[]>([]);
  private coursesSubject = new BehaviorSubject<any[]>([]);






  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.scrollToTop()
      this.userId = +params['userid']; // Ensure jobId is a number
      this.fetchData();
      this.fetchAllCoursesWithDetails();
    });

  }


  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  fetchData() {
    // Fetch personal details
    this.http.get<any>(`${environment.apiBaseUrl}/personalDetails/get/user/${this.userId}`).subscribe({
      next: (res: any) => {
        this.selectedMentor = res;
  
        // Fetch mentor statistics after personal details are retrieved
        this.http.get<any>(`${environment.apiBaseUrl}/course/mentor/getStats/${this.userId}`).subscribe({
          next: (statsRes: any) => {
            this.selectedMentor.courseStats = statsRes; // Attach stats to selectedMentor
          },
          error: (error) => {
            console.error("Error fetching mentor stats:", error);
            alert("Failed to fetch mentor statistics!");
          }
        });
      },
      error: (error) => {
        console.error("Error fetching mentor details:", error);
        alert("Something went wrong while fetching personal details!");
      }
    });
  }
  

  fetchCourses() {
    this.http.get<any>(`${environment.apiBaseUrl}/course/getByUser/${this.userId}`).subscribe({
      next: (res: any) => {
        this.courses = res;
      },
      error: (error) => {
        alert("Something went wrong!!!!")
      }
    });
  }

  private fetchAllCoursesWithDetails() {
    this.isLoading = true;
    const url = `${environment.apiBaseUrl}/course/getByUser/${this.userId}`;

    // If not in cache, make the HTTP request
    this.http.get<any[]>(url).pipe(
      mergeMap(courses => {
        const courseRequests = courses.map(course =>
          forkJoin({
            course: of(course),
            projectProgress: this.http.get<number>(
              `${environment.apiBaseUrl}/video/${course.courseTerm === 'long' ? 'progressOfCourse' : 'progressOfCourseOfUser'}/user/${this.userId}/course/${course.id}`
            ).pipe(
              catchError(() => of(0))
            ),
            enroled: this.http.get<boolean>(`${environment.apiBaseUrl}/enrollment/user/${this.userId}/course/${course.id}`).pipe(
              catchError(() => of(false))
            ),
          }).pipe(
            map(({ course, projectProgress, enroled }) => ({
              ...course,
              projectProgress,
              enroled,
              rating$: this.getRating(course.id),
              enrollmentCount$: this.getEnrollmentCount(course.id),
              showdata: false,
            }))
          )
        );
        return forkJoin(courseRequests);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
      catchError(() => of([]))
    ).subscribe(
      {next:coursesWithDetailsAndStats => {
        this.processCoursesResponse(coursesWithDetailsAndStats);
      },
      error:() => {
        this.isLoading = false;
      }}
    );
  }


  private processCoursesResponse(coursesWithDetailsAndStats: any[]) {
    const filteredCourses = coursesWithDetailsAndStats.filter(course =>
      course.coursePercentage > 90
    );
    this.coursesSubject.next(filteredCourses);
    this.filteredCourses$.next(filteredCourses);
    this.isLoading = false;
  }

  private getRating(courseId: number): Observable<number> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/course/reviews/${courseId}`).pipe(
      map(res => {
        if (Array.isArray(res) && res.length > 0) {
          const ratings = res.map(review => review.rating).filter(rating => typeof rating === 'number');
          return ratings.length > 0 ? ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length : 0;
        }
        return 0;
      }),
      catchError(() => of(0))
    );
  }


  generateStarsArray(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  generateEmptyStarsArray(rating: number): number[] {
    return Array(5 - Math.round(rating)).fill(0);
  }

  generateEmptyStarsArrayonly(): number[] {
    return Array(5).fill(0);
  }

  onInstructorSelect(user: any): void {
    if (user?.id) {
      this.router.navigate(['/usersprofile', user.id]);
    } else {
      console.error('User object or user ID is undefined');
    }
  }

  onInstructorSelect2(user: any): void {
    if (user) {
      this.router.navigate(['/usersprofile', user]);
    } else {
      console.error('User object or user ID is undefined');
    }
  }

  formatDuration(durationInMinutes: number): string {
    if (!durationInMinutes || isNaN(durationInMinutes)) {
      return 'Duration not available';
    }
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    if (hours === 0) {
      return `${minutes} min${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} min${minutes !== 1 ? 's' : ''}`;
    }
  }

  private getEnrollmentCount(courseId: number): Observable<number> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/course/enrollments/${courseId}`).pipe(
      map(res => res.length),
      catchError(() => of(0))
    );
  }

  getimage(course_image: string): SafeUrl {
    return (`data:image/png;base64,${course_image}`);
  }


  getRouterLink(course: any): string | null {
    if (course.projectProgress === 100) return null;
    return course.enroled ? '/coursedashboard' : '/courseland';
  }

  getQueryParams(course: any): any | null {
    if (course.projectProgress === 100) return null;
    return { courseId: course.id ? course.id : course.course_id };
  }

  getButtonText(course: any): string {
    if (course.projectProgress === 100) return 'Completed';
    return course.enroled ? 'Enrolled' : 'Enroll Now';
  }

  goBack() {
    window.history.back();
  }

  get skeletonArray(): number[] {
    return Array(6).fill(0);
  }

  roundUp(value: number): number {
    return Math.ceil(value);
  }




}
