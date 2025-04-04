 
 
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
export interface lessonModule {
  id: number;
  lessons?: Lesson[];
  lessonTitle: string
  title: string;
  description: string;
  // Add other properties as needed
}
interface LessonModule {
 
  id: number;
  lessonModuleId: number;
  moduleName: string;
  title: string;
  description: string;
  lessons?: Lesson[];
}
 
interface Lesson {
  id: number;
  lessonTitle: string;
}
interface Module {
  id: number;
  // Add other properties of the module here
  lessons?: Lesson[]; // The lessons property is optional as it's added later
}
 
export interface Video {
  id: number;
  videoTitle: string;
  s3Key: string;
  s3Url: string;
  videoDescription: string | null;
  createdAt: string;
  language: string | null;
}
 
interface lesson {
  lessons?: Lesson[];
 
  id: number;
  moduleName: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl: string;
  transcript: string;
  currentLesson: lesson;
  lessonModule: any;
  lessonTitle: string;
  lessonDescription: string;
  lessonContent: string;
  lessonDuration: number;
  createdAt: string;
  updatedAt: string;
  resources: { name: string; url: string }[];
  quiz: { question: string; options: string[]; correctAnswer: number }[];
}
export interface lessonModule {
  id: number;
  lessons?: Lesson[];
 
  title: string;
  description: string;
  // Add other properties as needed
}
export interface Video {
  id: number;
  videoTitle: string;
  s3Key: string;
  s3Url: string;
  videoDescription: string | null;
  createdAt: string;
  language: string | null;
}
 
export interface Assignment {
  maxScore: any;
  reviewMeetDate: Date;
  endDate: Date;
  startDate: Date;
  id: number;
  assignmentTitle: string;
  assignmentDescription: string;
  assignmentDocument: string; // Base64 encoded document
  assignmentTopicName: string;
}
/////////////AI quiz//////////////
// Define the AIQuiz model according to your backend structure
export interface AIQuiz {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  aiquizName: string;
  // Add any other relevant fields
}
//////////////////////////////////
 

interface VideoProgress {
  id: number;
  userId: number;
  videoId: number;
  progress: number;
}
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private coursesSubject = new BehaviorSubject<any[]>([]);
  courses$ = this.coursesSubject.asObservable();
  private currentLessonSubject = new BehaviorSubject<any>(null);
  currentLesson$ = this.currentLessonSubject.asObservable();
  currentVideo: any;
  setCurrentLesson(lesson: any) {
    this.currentLessonSubject.next(lesson);
  }
  private apiBaseUrl = environment.apiBaseUrl;
  private apiBaseUrlAI = environment.apiBaseUrlAI;
 
 
  // private apiBaseUrl = environment.apiBaseUrl;
  // ======= Ai assignment ============
  private assignmentSubject = new BehaviorSubject<any>(null);
  public assignment$ = this.assignmentSubject.asObservable();
 
  // ========================================
 
 
  constructor(private http: HttpClient) { }
 
 
  getVideosByCourse(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/video/courses/videos/${courseId}`);
  }
  getLessonModulesByCourseId(courseId: number): Observable<LessonModule[]> {
    return this.http.get<LessonModule[]>(`${this.apiBaseUrl}/getModuleByCourse/${courseId}`);
  }
  getLessonsByLessonModuleId(lessonModuleId: number): Observable<Lesson[]> {
    if (!lessonModuleId) {
      throw new Error('Invalid module ID');
    } return this.http.get<Lesson[]>(`${this.apiBaseUrl}/lesson/module/${lessonModuleId}`);
  }
 
  // In course.service.ts
  getLessonsByLessonModuleId1(lessonModuleId: number): Observable<Lesson[]> {
    return this.http.get<Lesson[]>(`/api/lessons?moduleId=${lessonModuleId}`);
  }
 
  // Service method to fetch lessons by module ID
  fetchLessonsByLessonModuleId(lessonModuleId: number): Observable<Lesson[]> {
    if (!lessonModuleId) {
      throw new Error('Invalid module ID');
    }
    return this.http.get<Lesson[]>(`${this.apiBaseUrl}/lesson/module/${lessonModuleId}`);
  }
 
 
  getVideosByLessonId(lessonId: number): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.apiBaseUrl}/video/videos/lesson/${lessonId}`);
  }
 
 
  // getVideosByCourse(courseId: number): Observable<any[]> {
  //   return this.http.get<any[]>(`${this.apiBaseUrl}/video/courses/videos/${courseId}`);
  // }
  // getLessonModulesByCourseId(courseId: number): Observable<LessonModule[]> {
  //   return this.http.get<LessonModule[]>(`${this.apiBaseUrl}/getModuleByCourse/${courseId}`);
  // }
  // getLessonsByLessonModuleId(lessonModuleId: number): Observable<lessonModule[]> {
  //   return this.http.get<lessonModule[]>(`${this.apiBaseUrl}/lesson/module/${lessonModuleId}`);
  // }
  // getVideosByLessonId(lessonId: number): Observable<Video[]> {
  //   return this.http.get<Video[]>(`${this.apiBaseUrl}/video/videos/lesson/${lessonId}`);
  // }
 
  fetchCourses(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/course/allCourses`)
      .pipe(
        tap(res => {
          const courses = res.map(course => ({
            ...course,
            safeImageUrl: this.createImageSrc(course.courseImage),
            duration: '2 hours', // You might want to add this field to your backend
            routerLink: ['/Javafullstack'], // Adjust as needed
            level4: course.level_4,
            level6: course.level_6,
            level7: course.level_7,
            level8: course.level_8,
            courseTitle: course.courseTitle,
            courseDescription: course.courseDescription,
            courseInstructor: course.courseInstructor,
 
 
 
          }));
          this.coursesSubject.next(courses);
        }),
        catchError(error => {
          console.error('Error fetching courses:', error);
          this.coursesSubject.next([]);
          return throwError(() => error);
        })
      )
      .subscribe();
  }
 
  private createImageSrc(imageData: string): string {
    return `data:image/png;base64,${imageData}`;
  }
 
  deleteCourse(courseId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiBaseUrl}/course/delete/${courseId}`)
      .pipe(
        catchError((error) => {
          console.error('Failed to delete course', error);
          return throwError(() => error);
        })
      );
  }
 
  getLessonsByCourseId(courseId: number): Observable<Lesson[]> {
    const url = `${this.apiBaseUrl}/lesson/course/${courseId}`;
    return this.http.get<Lesson[]>(url).pipe(
      catchError(this.handleError)
    );
  }
  // getUserDetails(userId: number): Observable<any> {
  //   return this.http.get(`${this.apiBaseUrl}/user/find/${userId}`)
  //     .pipe(catchError(this.handleError));
  // }
 
  // getCourseDetails(courseId: number): Observable<any> {
  //   return this.http.get(`${this.apiBaseUrl}/course/getBy/${courseId}`)
  //     .pipe(catchError(this.handleError));
  // }
 
  // getVideoByLessonId(lessonId: number): Observable<any> {
  //   return this.http.get(`${this.apiBaseUrl}/video/courses/videos/${lessonId}`)
  //     .pipe(catchError(this.handleError));
  // }
 
  // getCourseModules(courseId: number): Observable<any> {
  //   return this.http.get(`${this.apiBaseUrl}/getModuleByCourse/${courseId}`)
  //     .pipe(catchError(this.handleError));
  // }
 
  // getLessonByModuleId(moduleId: number): Observable<any> {
  //   return this.http.get(`${this.apiBaseUrl}/course/getLessonByModuleId/${moduleId}`)
  //     .pipe(catchError(this.handleError));
  // }
 
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    throw error; // Handle the error accordingly
  }
  // getVideoByLessonID(lessonId: number): Observable<{ s3Url?: string }> {
  //   return this.http.get<{ s3Url?: string }>(`${environment.apiBaseUrl}/video/courses/videos/${lessonId}`);
  // }
  getUserDetails(userId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/user/find/${userId}`)
      .pipe(catchError(this.handleError));
  }
 
  getCourseDetails(courseId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/course/getBy/${courseId}`)
      .pipe(catchError(this.handleError));
  }
 
  getVideoByLessonId(lessonId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/video/courses/videos/${lessonId}`)
      .pipe(catchError(this.handleError));
  }
 
  getCourseModules(courseId: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/getModuleByCourse/${courseId}`)
      .pipe(catchError(this.handleError));
  }
  getAssignmentsByLessonId(lessonId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiBaseUrl}/lesson/${lessonId}`)
  }
 
 
  // private handleError(error: any): Observable<never> {
  //   console.error('An error occurred:', error);
  //   throw error;
  // }
  getVideoByLessonID(lessonId: number): Observable<{ s3Url?: string }> {
    return this.http.get<{ s3Url?: string }>(`${environment.apiBaseUrl}/video/courses/videos/${lessonId}`);
  }
  /////////////get quizes/////////////
 
 
 
  /////////////////////////////notes submit//////////////////
 
  createNoteByVideo(userId: string, videoId: number, myNotes: string): Observable<any> {
    const url = `${this.apiBaseUrl}/user/2/video/${videoId}`;
    return this.http.post<any>(url, { notes: myNotes });
  }
 
 
  ///////////////////////////////////assignmentDetails////////////////////////
 
 
 
  /////////////get quizes/////////////
  fetchQuizzesByLessonId(lessonId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/quizzes/lesson/${lessonId}`);
  }
  ////////////////////////////////////
  /////////////get quiz questions/////////////
  fetchQuestionsForQuiz(quizId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/api/quizzes/${quizId}/questions`);
  }
  //////////////////////////////////////////
  //////////post quiz answers/////////////
  submitQuizAnswers(quizId: number, userId: number, answers: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiBaseUrl}/api/quizzes/${quizId}/users/${userId}/submitAnswers`, answers);
  }
  ////////////////////////////////////////
  ////////////////get quiz result///////////////
  getCorrectAnswerPercentage(quizId: number, userId: number): Observable<number> {
    return this.http.get<number>(`${this.apiBaseUrl}/api/quizzes/${quizId}/users/${userId}/percentage`);
  }
 
  getCorrectAnswerRatio(quizId: number, userId: number): Observable<string> {
    return this.http.get(`${this.apiBaseUrl}/api/quizzes/${quizId}/users/${userId}/ratio`, { responseType: 'text' });
  }
  //////////////////////////////////////////////assignmentPost///////////////////////
 
  submitAssignment(assignmentId: number, userId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('assignmentId', assignmentId.toString());
    formData.append('userId', userId);
    formData.append('file', file);
 
    return this.http.post(`${this.apiBaseUrl}/submitAssignment`, formData);
  }
 
 
 
  // -----------------------------student dashbord--------------------
  getCourseAssignments(courseId: number): Observable<any[]> {
 
    return this.http.get<any[]>(` http://localhost:8080/course/${courseId}`);
 
 
 
 
 
    // return this.http.get<any[]>(`http://localhost:8080/course/${courseId}`);
 
    // return this.http.get<any[]>(`http://localhost:8080/course/${courseId}`);
 
 
  }
 
     

 
 
/////////////////////chatbot/////////////////////////////////
 

 
 
 
 
 
sendQuery2(videoId: number, userQuery: string): Observable<string> {
  const payload = {
    id: videoId, // Explicitly send the video ID
    user_query: userQuery
  };
 
  console.log('sendQuery2 Payload:', payload); // Debugging: Log the payload
 
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
 
  return this.http.post<string>(`${this.apiBaseUrl}/chatRecommendations`, payload, { headers }).pipe(
    tap(response => console.log('sendQuery2 Response:', response)), // Debugging: Log the response
    catchError(error => {
      console.error('sendQuery2 Error:', error); // Debugging: Log any errors
      return throwError(() => error);
    })
  );


  
}
 
 
 
 
 
 
 
 
    //   saveProgress(userId: number, videoId: number, progress: number): Observable<any> {
    //     const url = `${this.apiBaseUrl}/video/saveProgress`;
    //     return this.http.post(url, null, {
    //         params: {
    //             userId: userId.toString(),
    //             videoId: videoId.toString(),
    //             progress: progress.toFixed(2)
    //         }
    //     });
    // }
  //   updateProgress(userId: number, videoId: number, progress: number): Observable<void> {
  //     const url = `${this.apiBaseUrl}/video/updateProgress`;
  //     return this.http.put<void>(url, null, {
  //         params: {
  //             userId: userId.toString(),
  //             videoId: videoId.toString(),
  //             progress: progress.toString()
  //         }
  //     });
  // }
  // updateProgress(userId: number, videoId: number, progress: number): Observable<any> {
  //   return this.http.post(`${this.apiBaseUrl}/progress/update`, { userId, videoId, progress });
  // }
//   getInitialProgress(userId: number, videoId: number): Observable<VideoProgress> {
//     const url = `${this.apiBaseUrl}/video/getProgress`;
//     return this.http.get<VideoProgress>(url, {
//         params: {
//             userId: userId.toString(),
//             videoId: videoId.toString()
//         }
//     });
// }
getProgress(userId: number, videoId: number): Observable<number> {
  return this.http.get<number>(`${this.apiBaseUrl}/progress/${userId}/${videoId}`).pipe(
    catchError(error => {
      console.error('Error fetching progress:', error);
      return of(0); // Return 0 if there's an error
    })
  );
}
 
/////////////////////////////////////////////////////////////////////////////////////////////
 
 
saveVideoProgress(userId: number, videoId: number, progress: number): Observable<string> {
  const url = `${this.apiBaseUrl}/video/saveProgress`;
  return this.http.post<string>(url, null, {
      params: {
          userId: userId.toString(),
          videoId: videoId.toString(),
          progress: progress.toFixed(2) // Ensure precision with 2 decimal places
      }
  });
}
 
updateVideoProgress(userId: number, videoId: number, progress: number): Observable<string> {
  const url = `${this.apiBaseUrl}/video/updateProgress`;
  return this.http.put<string>(url, null, {
      params: {
          userId: userId.toString(),
          videoId: videoId.toString(),
          progress: progress.toFixed(2) // Ensure precision with 2 decimal places
      }
  });
}
saveOrUpdateProgress(userId: number, videoId: number, progress: number): Observable<any> {
  const url = `${this.apiBaseUrl}/video/saveOrUpdateProgress`;
  let params = new HttpParams()
    .set('userId', userId.toString())
    .set('videoId', videoId.toString())
    .set('progress', progress.toString());
 
  console.log('Sending request with params:', params.toString()); // Add this line for debugging
 
  return this.http.post(url, null, { params });
}
getVideoProgress(userId: number, videoId: number): Observable<number> {
  const url = `${this.apiBaseUrl}/video/getProgress`;
  let params = new HttpParams()
    .set('userId', userId.toString())
    .set('videoId', videoId.toString());
 
  return this.http.get<VideoProgress>(url, { params }).pipe(
    map(response => response?.progress || 0),
    catchError(error => {
      console.error('Error fetching progress:', error);
      return of(0); // Return 0 if there's an error or no progress found
    })
  );
}
// getCourseProgress(userId: number, courseId: number): Observable<number> {
//   return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfCourseOfUser/user/${userId}/course/${courseId}`);
// }
// getCourseProgress(userId: number, courseId: number): Observable<number> {
//   return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfCourse/user/${userId}/course/${courseId}`);
// }
getCourseProgress(userId: number, courseId: number): Observable<number> {
  return this.http.get<number>(`${this.apiBaseUrl}/video/progressOfCourseOfUser/user/${userId}/course/${courseId}`);
}
  getCourseProjects(courseId: number): Observable<any[]> {
 
    return this.http.get<any[]>(`http://localhost:8080/course/${courseId}/projects`);
 
    // return this.http.get<any[]>(`http://localhost:8080/course/${courseId}/projects`);
  }
 
  ////////////////////////////////chatbot/////////////
 
 
 
 
  // ================AI Assignment ============================
  generateAssignment(userId: number, courseId: number, lessonId: number): Observable<any> {
    const payload = {
      user_id: userId,
      course_id: courseId,
      lesson_id: lessonId
    };
    console.log('Sending payload:', payload);
    return this.http.post<any>('http://localhost:8000/generate_assignment', payload).pipe(
      tap(response => {
        console.log('Response received in generateAssignment:', response);
        this.assignmentSubject.next(response);
      }),
      catchError(error => {
        console.error('Error in API call:', error);
        return throwError(() => error);
      })
    );
  }
 
  clearAssignment(): void {
    this.assignmentSubject.next(null); // Clear the current assignment data
  }
  saveAssignment(assignmentId: number, userAnswer: string): Observable<any> {
    const url = `${this.apiBaseUrl}/${assignmentId}/updateUserAnswer`;
    const payload = { userAnswer };
    return this.http.put<any>(url, payload);
  }
 
  evaluateAssignment(assignmentId: number): Observable<any> {
    const url = `http://localhost:8000/evaluate_assignment`;
    const payload = { ai_assignment_id: assignmentId };
    return this.http.post<any>(url, payload);
  }
    /////// Method to generate ai quiz///////
    // generateQuiz(requestBody: any): Observable<string> {
    //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //   return this.http.post<string>(`${this.apiBaseUrl}/generateQuiz`, requestBody, { headers });
    // }
    //////// Method to get AI quizzes by user and lesson////////
    getQuizzesByUserAndLesson(userId: number, lessonId: number): Observable<AIQuiz[]> {
      const url = `${this.apiBaseUrl}/user/${userId}/lesson/${lessonId}`;
      return this.http.get<AIQuiz[]>(url);
    }
    ////////////get quiz questions//////////
    getQuizQuestions(aiQuizId: number): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/aiQuiz/questions/${aiQuizId}`);
    }
    ////////////submit quiz answers//////////
    // submitAIQuizAnswers(aiQuizId: number, userId: number, answers: any[]): Observable<any> {
    //   const url = `${this.apiBaseUrl}/${aiQuizId}/${userId}/submit`;
    //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    //   return this.http.post(url, answers, { headers });
    // }
    // ////////////get AI quiz result///////////////
    // getQuizResult(aiQuizId: number, userId: number): Observable<any> {
    //   return this.http.get<any>(`${this.apiBaseUrl}/${aiQuizId}/${userId}/result`);
    // }


        /////// Method to generate AI quiz ///////
generateQuiz(requestBody: any): Observable<any> {
  return this.http.post(`${this.apiBaseUrlAI}/generate_quiz`, requestBody);
}

////////////post quiz Questions//////////
postQuizQuestion(quizId: any, questionData: any): Observable<any> {
  console.log('Calling API to post quiz question:', questionData);
  return this.http.post(`${this.apiBaseUrl}/postAiQuizQuestion/${quizId}`, questionData);
}

    ////////////submit quiz answers//////////
    submitAIQuizAnswers(aiQuizId: number, userId: number, answers: any[]): Observable<any> {
      const url = `${this.apiBaseUrl}/${aiQuizId}/${userId}/submit`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      console.log('Submitting quiz answers to API:', answers);
      return this.http.post(url, answers, { headers });
    }

    
    ////////////get AI quiz result///////////////
    getQuizResult(aiQuizId: any, userId: number): Observable<any> {
      return this.http.get<any>(`${this.apiBaseUrl}/${aiQuizId}/${userId}/result`);
    }

    
}
 
 
 
 