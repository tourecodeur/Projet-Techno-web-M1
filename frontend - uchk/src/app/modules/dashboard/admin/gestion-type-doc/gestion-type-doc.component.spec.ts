import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTypeDocComponent } from './gestion-type-doc.component';

describe('GestionTypeDocComponent', () => {
  let component: GestionTypeDocComponent;
  let fixture: ComponentFixture<GestionTypeDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionTypeDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionTypeDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
