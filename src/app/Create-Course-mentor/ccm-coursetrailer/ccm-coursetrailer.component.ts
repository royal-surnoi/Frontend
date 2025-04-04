import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ccm-coursetrailer',
  standalone: true,
  imports: [],
  templateUrl: './ccm-coursetrailer.component.html',
  styleUrl: './ccm-coursetrailer.component.css'
})
export class CcmCoursetrailerComponent {

  courseId: string | undefined;

  constructor(private route: ActivatedRoute){  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['CourseId'];
    });
  }
  
}
