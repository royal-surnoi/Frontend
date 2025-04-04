import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ccm-project',
  standalone: true,
  imports: [],
  templateUrl: './ccm-project.component.html',
  styleUrl: './ccm-project.component.css'
})
export class CcmProjectComponent {

  courseId: string | undefined;

  constructor(private route: ActivatedRoute){  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['CourseId'];
    });
  }
  
}
