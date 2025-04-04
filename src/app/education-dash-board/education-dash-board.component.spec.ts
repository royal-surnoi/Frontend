import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationDashBoardComponent } from './education-dash-board.component';

describe('EducationDashBoardComponent', () => {
  let component: EducationDashBoardComponent;
  let fixture: ComponentFixture<EducationDashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EducationDashBoardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EducationDashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
