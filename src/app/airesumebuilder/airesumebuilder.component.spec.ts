import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiresumebuilderComponent } from './airesumebuilder.component';

describe('AiresumebuilderComponent', () => {
  let component: AiresumebuilderComponent;
  let fixture: ComponentFixture<AiresumebuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiresumebuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiresumebuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
