import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiassignmentComponent } from './aiassignment.component';

describe('AiassignmentComponent', () => {
  let component: AiassignmentComponent;
  let fixture: ComponentFixture<AiassignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiassignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiassignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
