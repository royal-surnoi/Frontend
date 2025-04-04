import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcadamicInstituteComponent } from './acadamic-institute.component';

describe('AcadamicInstituteComponent', () => {
  let component: AcadamicInstituteComponent;
  let fixture: ComponentFixture<AcadamicInstituteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcadamicInstituteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcadamicInstituteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
