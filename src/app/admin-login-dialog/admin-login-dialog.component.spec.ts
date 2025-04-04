import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLoginDialogComponent } from './admin-login-dialog.component';

describe('AdminLoginDialogComponent', () => {
  let component: AdminLoginDialogComponent;
  let fixture: ComponentFixture<AdminLoginDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLoginDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
