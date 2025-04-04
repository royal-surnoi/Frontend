import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcmPlanningComponent } from './ccm-planning.component';

describe('CcmPlanningComponent', () => {
  let component: CcmPlanningComponent;
  let fixture: ComponentFixture<CcmPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcmPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcmPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
