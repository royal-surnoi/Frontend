import { HttpClient, HttpHeaders,} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class JobOtpPasswordResetService {
  private apiUrl = 'http://localhost:8080/jobAdmin/change-password-otp'; // Backend endpoint URL
 
  constructor(private http: HttpClient) {}
 
  resetPassword(requestBody: { jobAdminEmail: string; adminOtp: number; newPassword: string }): Observable<string> {
    const params = new URLSearchParams({
      jobAdminEmail: requestBody.jobAdminEmail,
      adminOtp: requestBody.adminOtp.toString(),
      newPassword: requestBody.newPassword
    });
 
    return this.http.put<string>(`${this.apiUrl}?${params.toString()}`,{}, {
      headers: new HttpHeaders({
      }),
      responseType: 'text' as 'json',
    } );
 
  }
}