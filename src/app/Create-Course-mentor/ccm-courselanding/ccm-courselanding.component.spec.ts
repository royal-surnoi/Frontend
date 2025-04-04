import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcmCourselandingComponent } from './ccm-courselanding.component';

describe('CcmCourselandingComponent', () => {
  let component: CcmCourselandingComponent;
  let fixture: ComponentFixture<CcmCourselandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcmCourselandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcmCourselandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
