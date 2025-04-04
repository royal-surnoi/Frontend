import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface InstituteStudent {
  id?: number; // Optional because it may not be provided during creation
  studentName: string;
  instituteRegistrationNo: string;
  studentClass: string;
  section: string;
  institute_Type: string;
  location: string;
  password: string;
  confirmPassword: string;
  email: string;
  pincode:number;
  status: Status; // Enum type for status
 
}

export interface StudentName {
  toLowerCase(): unknown;
  student: any;
  id: number;
  studentName: string;
}
 
export enum Status {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  PENDING = 'PENDING'
}

@Injectable({
  providedIn: 'root'
})
export class AcadamicStudentServiceService {

  private apiBaseUrl = environment.apiBaseUrl;
 
  constructor(private http: HttpClient) {}

  registerStudent(
    instituteId: number,
    userId: number,
    student: InstituteStudent
  ): Observable<InstituteStudent> {
    const url = `${this.apiBaseUrl}/api/students/register/${instituteId}/${userId}`;
   
    return this.http.post<InstituteStudent>(url, student);
  }
 
 
 
  ////otp verification post///
 
  verifyOtp(id: number, otp: string): Observable<string> {
    const url = `${this.apiBaseUrl}/api/students/verify-otp/${id}`;
    const params = new HttpParams().set('otp', otp);
 
    return this.http.post(url, {}, { params, responseType: 'text' });
  }
 

  getSubject(studentId:number){
    return this.http.get(`${this.apiBaseUrl}/classroom/students/by-student?studentId=${studentId}`)
  }
   
  getStudentNamesByClass(classId: number): Observable<StudentName[]> {
    return this.http.get<StudentName[]>(`${this.apiBaseUrl}/classroom/students/by-class?classId=${classId}`);
  }
  
  getClassById(classId: number): Observable<any> {
    return this.http.get<any>(`${this.apiBaseUrl}/classrooms/byClass/${classId}`);
  }
  
}
