import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcadamicLoginComponent } from './acadamic-login.component';

describe('AcadamicLoginComponent', () => {
  let component: AcadamicLoginComponent;
  let fixture: ComponentFixture<AcadamicLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcadamicLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcadamicLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
