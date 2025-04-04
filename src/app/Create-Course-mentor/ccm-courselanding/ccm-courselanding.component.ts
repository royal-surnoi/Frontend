import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ccm-courselanding',
  standalone: true,
  imports: [],
  templateUrl: './ccm-courselanding.component.html',
  styleUrl: './ccm-courselanding.component.css'
})
export class CcmCourselandingComponent {

  courseId: string | undefined;

  constructor(private route: ActivatedRoute){  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['CourseId'];
    });
  }

}
