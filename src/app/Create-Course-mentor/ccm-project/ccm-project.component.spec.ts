import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcmProjectComponent } from './ccm-project.component';

describe('CcmProjectComponent', () => {
  let component: CcmProjectComponent;
  let fixture: ComponentFixture<CcmProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcmProjectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcmProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
