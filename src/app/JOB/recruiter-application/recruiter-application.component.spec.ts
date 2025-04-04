import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterApplicationComponent } from './recruiter-application.component';

describe('RecruiterApplicationComponent', () => {
  let component: RecruiterApplicationComponent;
  let fixture: ComponentFixture<RecruiterApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
