import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ccm-planning',
  standalone: true,
  imports: [],
  templateUrl: './ccm-planning.component.html',
  styleUrl: './ccm-planning.component.css'
})
export class CcmPlanningComponent {

  courseId: string | undefined;

  constructor(private route: ActivatedRoute){  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['CourseId'];
    });
  }
  
}
