import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ccm-pricing',
  standalone: true,
  imports: [],
  templateUrl: './ccm-pricing.component.html',
  styleUrl: './ccm-pricing.component.css'
})
export class CcmPricingComponent {

  courseId: string | undefined;

  constructor(private route: ActivatedRoute){  }
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['CourseId'];
    });
  }
}
