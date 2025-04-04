import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, mergeMap, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { RouterLink } from '@angular/router';



interface Mentor {
  id: number;
  name: string;
  subject: string;
  image: string;
  language: string;
  experience: string;
  description: string;
  onThisSite: string;
  hourlyRate: number;
  rating: number;
}

@Component({
  selector: 'app-mentors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './mentors.component.html',
  styleUrl: './mentors.component.css'
})
export class MentorsComponent implements OnInit {
  currentOption: string = '';
  searchQuery = '';
  selectedMentor: any | null = null;
  mentorList: any[] = [];
  followmentorList: any[] = [];
  filteredMentorList: any[] = [];
  filteredfollowmentorList: any[] = [];
  userId: any;

  constructor(private http: HttpClient) {

  }



  ngOnInit() {
    this.currentOption = "findTeachers";
    this.userId = localStorage.getItem("id")
    this.getMentorsListToFollow();
    this.getMentorsListFollow();
  }


  selectMentor(mentor: Mentor) {
    this.selectedMentor = mentor;
  }

  closeMentorDetails() {
    this.selectedMentor = null;
  }


  private getMentorsListToFollow(): void {
    const userId = localStorage.getItem('id');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    forkJoin({
      userDetails: this.http.get<any[]>(`${environment.apiBaseUrl}/user/mentorsIds`).pipe(
        mergeMap(res =>
          forkJoin(
            res.map(id =>
              forkJoin({
                personalDetails: this.http.get<any>(`${environment.apiBaseUrl}/personalDetails/get/user/${id}`).pipe(
                  catchError(error => {
                    console.error(`Error fetching details for user ${id}:`, error);
                    return of(null);
                  })
                ),
                mentorStats: this.http.get<any>(`${environment.apiBaseUrl}/course/mentor/getStats/${id}`).pipe(
                  catchError(error => {
                    console.error(`Error fetching mentor stats for user ${id}:`, error);
                    return of(null);
                  })
                )
              })
            )
          )
        )
      ),
      followingIds: this.getFollowingIds()
    }).subscribe({
      next: ({ userDetails, followingIds }) => {
        this.mentorList = userDetails
          .filter(user => user.personalDetails !== null) // Filter out failed requests
          .map(user => ({
            ...user.personalDetails,
            courseStats: user.mentorStats || { totalCourses: 0, averageCost: 0, courseNames: [] },
            isActive: followingIds.includes(user.personalDetails.user.id),
            isLoading: false,
            isVisible: !followingIds.includes(user.personalDetails.user.id),
            isFollowed: false
          }));
  
        console.log(this.mentorList);
        this.filterMentors();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }
  

  private getMentorsListFollow(): void {
    const userId = localStorage.getItem('id');
    if (!userId) {
      console.error('User ID not found in localStorage');
      return;
    }
  
    forkJoin({
      userDetails: this.http.get<any[]>(`${environment.apiBaseUrl}/follow/findFollowingIdsByFollowerId/${this.userId}`).pipe(
        mergeMap(res =>
          forkJoin(
            res.map(id =>
              forkJoin({
                personalDetails: this.http.get<any>(`${environment.apiBaseUrl}/personalDetails/get/user/${id}`).pipe(
                  catchError(error => {
                    console.error(`Error fetching details for user ${id}:`, error);
                    return of(null);
                  })
                ),
                mentorStats: this.http.get<any>(`${environment.apiBaseUrl}/course/mentor/getStats/${id}`).pipe(
                  catchError(error => {
                    console.error(`Error fetching mentor stats for user ${id}:`, error);
                    return of(null);
                  })
                )
              })
            )
          )
        )
      )
    }).subscribe({
      next: ({ userDetails }) => {
        this.followmentorList = userDetails
          .filter(user => user.personalDetails !== null) // Filter out failed requests
          .map(user => ({
            ...user.personalDetails,
            courseStats: user.mentorStats || { totalCourses: 0, averageCost: 0, courseNames: [] },
            isFollowed: true
          }));
  
        console.log(this.followmentorList);
        this.filterFollowMentors();
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
    this.filteredMentorList = this.searchQuery
      ? this.mentorList.filter(mentor =>
        mentor.isVisible &&
        (mentor.user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          mentor.profession.toLowerCase().includes(this.searchQuery.toLowerCase()))
      )
      : this.mentorList.filter(mentor => mentor.isVisible);
  }

  filterFollowMentors(): void {
    this.filteredfollowmentorList = this.searchQuery
      ? this.followmentorList.filter(mentor =>
        (mentor.user.name.toLowerCase().includes(this.searchQuery.toLowerCase())  ||
        mentor.profession.toLowerCase().includes(this.searchQuery.toLowerCase())))
      : this.followmentorList;
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

    const person = this.mentorList.find(p => p.user.id === personId);
    person.isLoading = true;


    this.http.post(`${environment.apiBaseUrl}/follow/saveByIds?followerId=${userIdNumber}&followingId=${personId}`, {})
      .subscribe({
        next: (res: any) => {
          const person = this.mentorList.find(p => p.user.id === personId);
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

  togglePerson(person: any): void {
    if (person.isLoading) return;

    person.isLoading = true;
    person.isActive = !person.isActive;

    if (person.isActive) {
      this.loadPersonData(person);
    } else {
      this.unloadPersonData(person);
    }
  }

  private loadPersonData(person: any): void {
    setTimeout(() => {
      person.isLoading = false;
      this.filterMentors();
    }, 1000);
  }

  private unloadPersonData(person: any): void {
    setTimeout(() => {
      person.isLoading = false;
      this.filterMentors();
    }, 10);
  }

  changetab() {
    if (this.currentOption == 'findTeachers') {
      this.currentOption = 'myTeachers'
    }
    else {
      this.currentOption = 'findTeachers'
    }
    this.selectedMentor = null;
  }

  roundUp(value: number): number {
    return Math.ceil(value);
}

}