import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AcadamicTeacherServiceService } from '../../../acadamic-service/acadamic-teacher-service.service';



@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [FormsModule, CommonModule,ReactiveFormsModule],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.css'
})
export class ClassesComponent {

  searchQuery: string = '';

  userid?:number;
  Teacherid!:number;
  subjects:any[]=[];
  instituteid:number = 1;

  subjectForm!: FormGroup;
  isPopupOpen = false;
  today: string = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format


  constructor(private router:Router, private route:ActivatedRoute,private service:AcadamicTeacherServiceService, private fb: FormBuilder){}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userid = Number(localStorage.getItem('id'))
      this.Teacherid = +params['id']; // Ensure Institute id is a number
      this.Teacherid = 1;
    });
    this.getSubjects();

    this.subjectForm = this.fb.group({
      className: ['', Validators.required],
      classSubject: ['', Validators.required],
      academicYearStart: ['', Validators.required],
      academicYearEnd: ['', Validators.required],
      classGrade: ['', Validators.required],
      classSection: ['', Validators.required],
    });
  }

  
 

  getSubjects(){
    this.service.getSubjects(this.Teacherid).subscribe(
      {next:(response:any)=>{
        console.log(response)
        this.subjects = response;
      },
      error:(error)=>{
        console.log(error);
      }}
    )
  }

  get filteredSubjects() {
    if (!this.searchQuery.trim()) {
      return this.subjects;
    }
    return this.subjects.filter(subject =>
      subject.classSubject.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  openSubjectComponent(subjectId: number) {
    this.router.navigate(['/subject', subjectId]);
  }

  addSubject(): void {
    if (this.subjectForm.valid) {
      console.log('Form Submitted:', this.subjectForm.value);
      this.service.CreateSubject(this.Teacherid,this.instituteid,this.subjectForm.value).subscribe(
        {next:(response:any)=>{
          console.log(response);
          this.isPopupOpen = false;
          this.subjectForm.reset();
          this.getSubjects();
          alert("Subject Created Successfully!!!");
        },
        error:(error)=>{
          console.log(error);
          alert("Something went Wrong Try again!!")
        }}
      )
       
    }
  }

  togglePopup(): void {
    this.isPopupOpen = !this.isPopupOpen;
  }

  getFormattedDate(inputDate: number[]): string {
    const [year, month, day] = inputDate;
    const date = new Date(year, month - 1, day); 
    const newDate = new Date(date.setFullYear(date.getFullYear() - 1)); 
    newDate.setDate(2); 
    newDate.setMonth(0);
    return newDate.toISOString().split('T')[0];
  }

  getTruncatedContent(subject: any): string {
    const content = `${subject.classSubject} - ${subject.className} - ${subject.classGrade} - ${subject.classSection} - (${this.getFormattedDate(subject.academicYearStart)}-${this.getFormattedDate(subject.academicYearEnd)})`;
    return content.length > 97 ? content.slice(0, 97) + '...' : content;
  }
  
  
}

