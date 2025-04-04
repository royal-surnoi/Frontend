import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentSubjectDeatilsComponent } from './student-subject-deatils.component';

describe('StudentSubjectDeatilsComponent', () => {
  let component: StudentSubjectDeatilsComponent;
  let fixture: ComponentFixture<StudentSubjectDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentSubjectDeatilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentSubjectDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
