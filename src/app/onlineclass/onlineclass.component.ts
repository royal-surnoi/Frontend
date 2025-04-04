import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MentoronlineService } from '../mentoronline.service';
 
@Component({
  selector: 'app-onlineclass',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,MatIconModule],
  templateUrl: './onlineclass.component.html',
  styleUrl: './onlineclass.component.css'
})
export class OnlineclassComponent implements OnInit {
  courseId: number | null = null;
  courseForm!: FormGroup;
  course:any;
 
  roomName: string = '';
  scheduledTime: string = '';
  currentDateTime: string = '';
 
  constructor(private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private mentoronlineService: MentoronlineService
  ) { }
 
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('courseId'));
    this.courseForm = this.fb.group({
      courses: this.fb.array([this.createCourseGroup()])
    });
 
    this.courseId = +this.route.snapshot.paramMap.get('courseId')!;
    if (this.courseId) {
      this.loadCourse(this.courseId);
    }
 
    const now = new Date();
    this.currentDateTime = now.toISOString().slice(0, 16); // Format for datetime-local input
 
  }
   
  navigateToDashboard(): void {
    this.router.navigate(['/mentorperspective']);
  }
  loadCourse(id: number): void {
    this.mentoronlineService.getCourseById(id).subscribe(
      {next:data => this.course = data,
      error:(error) => console.error(error)
      }
    );
  }
get courses() {
  return this.courseForm.get('courses') as FormArray;
}
createCourseGroup(): FormGroup {
  return this.fb.group({
   
    courseTopic: ['', Validators.required],
    meetingStarting: ['', Validators.required]  // Add meetingStarting field
 
  });
}
addCourse() {
  this.courses.push(this.createCourseGroup());
}
removeCourse(index: number) {
  this.courses.removeAt(index);
}
 
onSubmitOnline() {
  console.log(this.courseForm.value);
}


onSubmit() {
  if (!this.roomName || !this.scheduledTime || !this.courseId) {
    alert('Please provide all required fields.');
    return;
  }

  const scheduledDate = new Date(this.scheduledTime);
  const now = new Date();

  if (scheduledDate < now) {
    alert('Scheduled time must be in the future.');
    return;
  }

  this.mentoronlineService.createRoom(this.roomName, this.courseId, scheduledDate).subscribe(
    {next:(response) => {
      console.log('Training room created successfully', response);
      alert('Class created successfully');
      this.router.navigate(['/mentorperspective']);
    },
    error:(error) => {
      console.error('Error creating training room', error);
      alert('Unable to create training room. Please try again.');
    }}
  );
}

 
}