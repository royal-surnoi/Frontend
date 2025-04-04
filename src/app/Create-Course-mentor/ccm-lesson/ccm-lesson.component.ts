import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ccm-lesson',
  standalone: true,
  imports: [],
  templateUrl: './ccm-lesson.component.html',
  styleUrl: './ccm-lesson.component.css'
})
export class CcmLessonComponent {

  courseId: string | undefined;

  constructor(private route: ActivatedRoute){  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['CourseId'];
    });
  }
  
}
