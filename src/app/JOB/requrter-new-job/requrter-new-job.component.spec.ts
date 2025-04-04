import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequrterNewJobComponent } from './requrter-new-job.component';

describe('RequrterNewJobComponent', () => {
  let component: RequrterNewJobComponent;
  let fixture: ComponentFixture<RequrterNewJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequrterNewJobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequrterNewJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
