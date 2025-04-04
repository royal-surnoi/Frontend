import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequrterInfoComponent } from './requrter-info.component';

describe('RequrterInfoComponent', () => {
  let component: RequrterInfoComponent;
  let fixture: ComponentFixture<RequrterInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequrterInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequrterInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
