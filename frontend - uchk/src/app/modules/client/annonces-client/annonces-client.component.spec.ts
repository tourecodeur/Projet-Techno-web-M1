import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncesClientComponent } from './annonces-client.component';

describe('AnnoncesClientComponent', () => {
  let component: AnnoncesClientComponent;
  let fixture: ComponentFixture<AnnoncesClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnoncesClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnoncesClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
