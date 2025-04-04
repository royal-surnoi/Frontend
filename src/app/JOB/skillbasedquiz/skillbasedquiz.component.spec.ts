import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillbasedquizComponent } from './skillbasedquiz.component';

describe('SkillbasedquizComponent', () => {
  let component: SkillbasedquizComponent;
  let fixture: ComponentFixture<SkillbasedquizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillbasedquizComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillbasedquizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
