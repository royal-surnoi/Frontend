import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-course-create',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule], // Import necessary modules
  templateUrl: './main-course-create.component.html',
  styleUrls: ['./main-course-create.component.css']
})
export class MainCourseCreateComponent implements OnInit {
  courseId: string | undefined;
  currentTab: string = 'courselanding';
  isFolded = false;

  constructor(private route: ActivatedRoute){  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['CourseId'];
    });
  }

  isActive(tab: string): boolean {
    return this.currentTab == tab;;
  }

  toggleFold() {
    this.isFolded = !this.isFolded;
  }
}
