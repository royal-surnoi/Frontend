import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatesPageComponent } from './certificates-page.component';

describe('CertificatesPageComponent', () => {
  let component: CertificatesPageComponent;
  let fixture: ComponentFixture<CertificatesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificatesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificatesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
