import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainCourseCreateComponent } from './main-course-create.component';

describe('MainCourseCreateComponent', () => {
  let component: MainCourseCreateComponent;
  let fixture: ComponentFixture<MainCourseCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainCourseCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainCourseCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
