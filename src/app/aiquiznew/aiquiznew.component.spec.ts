import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiquiznewComponent } from './aiquiznew.component';

describe('AiquiznewComponent', () => {
  let component: AiquiznewComponent;
  let fixture: ComponentFixture<AiquiznewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiquiznewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiquiznewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
