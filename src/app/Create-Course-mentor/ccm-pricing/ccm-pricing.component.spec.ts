import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcmPricingComponent } from './ccm-pricing.component';

describe('CcmPricingComponent', () => {
  let component: CcmPricingComponent;
  let fixture: ComponentFixture<CcmPricingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CcmPricingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CcmPricingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
