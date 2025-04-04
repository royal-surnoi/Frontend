import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams} from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';

export interface Institute {
  institute_Name: string;
  id: number;
  instituteName: string;
  location: string;
  principalName: string;
  instituteRegistrationNo: string;
  instituteType: string;
  board: string;
  email: string;
  image: string; // Base64 string for image
  addPassword: string;
  confirmPassword: string;
  pincode: string;
  contactNo: string;
  description: string;
  profileImage: string; // Base64 string for profile image
  establishedIn: number;
  teachers: InstituteTeacher[] | null; // List of associated teachers
  students: any[] | null; // Adjust based on student structure
}
 
export interface InstituteTeacher {
  id: number;
  teacherId: string;
  teacher_Name: string;
  subject: string;
  instituteType: string;
  location: string;
  email: string;
  password: string;
  confirmPassword: string;
  pincode:number;
  status: "ACCEPTED" | "PENDING" | "REJECTED";
  institutes: Institute; // Associated institute details
  userId: number;
  instituteId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AcadamicTeacherServiceService {

  private apiBaseUrl = environment.apiBaseUrl;
 
  constructor(private http: HttpClient) {}

  registerTeacher(
    teacher: any,
    institute:number
  ): Observable<any> {
    const params = new HttpParams()
      .set('teacherId', teacher.teacherId)
      .set('teacher_Name', teacher.teacher_Name)
      .set('subject', teacher.subject)
      .set('institute_Type', teacher.instituteType)
      .set('location', teacher.location)
      .set('password', teacher.password)
      .set('confirm_Password', teacher.confirmPassword)
      .set('email', teacher.email)
      .set('pincode',teacher.pincode)
      .set('status', "PENDING")
      .set('instituteId', institute)
      .set('userId', teacher.userId.toString());
 
 
 
    return this.http.post(`${this.apiBaseUrl}/api/teachers/register`, null, { params });
  }
 
 
 
  verifyTeacherOtp(id: number, otp: string): Observable<string> {
    const url = `${this.apiBaseUrl}/api/teachers/verify-otp/${id}`;
    const params = new HttpParams().set('otp', otp);
 
    return this.http.post<string>(url, {}, { params });
  }

  getSubjects(teacherId:number){
    return this.http.get(`${this.apiBaseUrl}/classrooms/by-teacher/${teacherId}`)  
  }

  CreateSubject(teacherId:number,instituteId:number,NewSubject:any){
    return this.http.post(`${this.apiBaseUrl}/classrooms/CreateClass/${teacherId}/${instituteId}`,NewSubject)
  }
   
  getSujectDetails(subjectId:number){
    return this.http.get(`${this.apiBaseUrl}/classrooms/byClass/${subjectId}`)
  }

  getstudents(subjectId:number,InsituteId:number){
    return this.http.get<any[]>(`${this.apiBaseUrl}/classroom/students/by-insitute?InsituteId=${InsituteId}&classroomId=${subjectId}`)
  }

  addStudents(subjectId:number,teacherId:number,studentIds:string){
    return this.http.post<any[]>(`${this.apiBaseUrl}/classroom/students/addMultiple?classroomId=${subjectId}&teacherId=${teacherId}&studentIds=${studentIds}`,{})
  }

  getInstitutesByCriteria(
    pincode?: string,
    instituteName?: string,
    location?: string
  ): Observable<Institute[]> {
    // Construct the query parameters dynamically
    let params = new HttpParams();
    if (pincode) params = params.set('pincode', pincode);
    if (instituteName) params = params.set('institute_Name', instituteName);
    if (location) params = params.set('location', location);
 
    return this.http
      .get<Institute[]>(`${this.apiBaseUrl}/api/institute/search`, { params })
      .pipe(
        map((response: Institute[]) => response),
        catchError((error) => {
          console.error('Error fetching institutes:', error);
          return [];
        })
      );
  }
   
}
