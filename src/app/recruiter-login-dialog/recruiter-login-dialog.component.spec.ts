import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterLoginDialogComponent } from './recruiter-login-dialog.component';

describe('RecruiterLoginDialogComponent', () => {
  let component: RecruiterLoginDialogComponent;
  let fixture: ComponentFixture<RecruiterLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecruiterLoginDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecruiterLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
