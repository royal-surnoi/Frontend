import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcadamicInstituteServiceService {

  private apiBaseUrl = environment.apiBaseUrl;
 
  constructor(private http: HttpClient) {}

  registerOrganisation(
    organizationName: string,
    location: string,
    principalName: string,
    registrationNo: string,
    organizationType: string,
    board: string,
    image: File | string,
    addPassword: string,
    confirmPassword: string
  ): Observable<string> {
    const formData = new FormData();
    formData.append('organization_Name', organizationName);
    formData.append('location', location);
    formData.append('principal_name', principalName);
    formData.append('organization_Registration_No', registrationNo);
    formData.append('organization_Type', organizationType);
    formData.append('board', board);
    if (typeof image === 'object') {
      formData.append('image', image);
    }
    formData.append('addPassword', addPassword);
    formData.append('confirmPassword', confirmPassword);
 
    return this.http.post<string>(
      `${this.apiBaseUrl}/api/organisation/register`,
      formData,
      {
        headers: new HttpHeaders({
          'enctype': 'multipart/form-data',
        }),
        responseType: 'text' as 'json',
      }
    );
  }

  getInstituteById(id: number): Observable<any> {
    return this.http.get(`${this.apiBaseUrl}/api/institute/${id}`);
  }

  updateInstituteDetails(id: number, contactNo: string, description: string, profileImage: File | null , establishedIn: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('contactNo', contactNo);
    formData.append('description', description);
    if (profileImage) {
      formData.append('profileImage', profileImage, profileImage.name);
    }
    formData.append('establishedIn', establishedIn.toString());

    return this.http.put<any>(`${this.apiBaseUrl}/api/institute/${id}/details`, formData);
  }

  getAccounts(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiBaseUrl}/api/institute/GetAccounts/${userId}`);
  }

   
  registerInstitute(formData: FormData): Observable<string> {
    return this.http.post(`${this.apiBaseUrl}/api/institute/register`, formData, {
      responseType: 'text'
    });
  }

  updateInstitute(data: {
    id: number;
    instituteName: string;
    location: string;
    principalName: string;
    registrationNo: string;
    instituteType: string;
    board: string;
    email: string;
    addPassword: string;
    confirmPassword: string;
    pincode: string;
    contactNo: string;
    description: string;
    establishedIn: number;
    profileImage: File;
  }): Observable<string> {
    const formData = new FormData();
    formData.append('id', data.id.toString());
    formData.append('institute_Name', data.instituteName);
    formData.append('location', data.location);
    formData.append('principal_name', data.principalName);
    formData.append('institute_Registration_No', data.registrationNo);
    formData.append('instituteType', data.instituteType);
    formData.append('board', data.board);
    formData.append('email', data.email);
    formData.append('addPassword', data.addPassword);
    formData.append('confirmPassword', data.confirmPassword);
    formData.append('pincode', data.pincode);
    formData.append('contactNo', data.contactNo);
    formData.append('description', data.description);
    formData.append('establishedIn', data.establishedIn.toString());
    formData.append('profileImage', data.profileImage);

    return this.http.put<string>(`${this.apiBaseUrl}/api/institute/update`, formData, {
      headers: new HttpHeaders({

      }),
      responseType: 'text' as 'json',
    });
  }
}
