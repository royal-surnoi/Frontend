import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequrterRequrtmentComponent } from './requrter-requrtment.component';

describe('RequrterRequrtmentComponent', () => {
  let component: RequrterRequrtmentComponent;
  let fixture: ComponentFixture<RequrterRequrtmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequrterRequrtmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequrterRequrtmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
