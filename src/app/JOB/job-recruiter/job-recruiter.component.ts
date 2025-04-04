import { Component } from '@angular/core';
import { RequrterRequrtmentComponent } from '../requrter-requrtment/requrter-requrtment.component';
import { CommonModule } from '@angular/common';
import { RequrterNewJobComponent } from '../requrter-new-job/requrter-new-job.component';
import { RequrterInfoComponent } from '../requrter-info/requrter-info.component';
import { Router } from '@angular/router';
import { Recruiter,JobRecruiterService } from '../../job-recruiter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-job-recruiter',
  standalone: true,
  imports: [CommonModule, RequrterRequrtmentComponent, RequrterNewJobComponent, RequrterInfoComponent],
  templateUrl: './job-recruiter.component.html',
  styleUrl: './job-recruiter.component.css'
})
export class JobRecruiterComponent {
activeTab : string = 'Requrtment'

constructor(
  private router: Router,
private service:JobRecruiterService,
private sanitizer: DomSanitizer,
private http:HttpClient){}

recruiter:Recruiter | undefined;
interviews: any[] = [];
selectedInterview: any = null;
todayDate: Date = new Date();


recurterid!:number;

ngOnInit(): void {
    this.recurterid = Number(localStorage.getItem('recruiterId'))
    this.getuserData();
    this.fetchInterviews();
  }

  getuserData(){
    this.service.getRecruiterById(this.recurterid).subscribe({
      next: (response) => {
        this.recruiter = response; // Assign the API response
        this.recruiter.jobAdmin.companyLogo = this.sanitizer.bypassSecurityTrustUrl(`data:image/png;base64,${response.jobAdmin.companyLogo}`)

        console.log(this.recruiter);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

logoutRecurter(){
  localStorage.setItem('recruiterId', "");
  this.router.navigate(['/JobRecruiterLogin']);
}

fetchInterviews(): void {
  const apiUrl = `http://localhost:8080/api/interviews/today/recruiter/${this.recurterid}`;
  this.http.get<any[]>(apiUrl).subscribe((data) => {
    this.interviews = data;
  });
}

formatTimeForInteview(timestamp: number[]): string {
  const [year, Month, date, hours, minutes] = timestamp;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${date}-${Month}-${year} ${displayHours}:${displayMinutes} ${period}`;
}


islogoutPopUpOpen:boolean = false;

logoutpopshow(){
  this.islogoutPopUpOpen = true;
}

logoutpopClose(){
  this.islogoutPopUpOpen = false;
}

onLogoutSubmit(){
  this.logoutRecurter();
  this.islogoutPopUpOpen = false;
}


}
