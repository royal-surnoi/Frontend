import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcadamicHomeComponent } from './acadamic-home.component';

describe('AcadamicHomeComponent', () => {
  let component: AcadamicHomeComponent;
  let fixture: ComponentFixture<AcadamicHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcadamicHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcadamicHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
