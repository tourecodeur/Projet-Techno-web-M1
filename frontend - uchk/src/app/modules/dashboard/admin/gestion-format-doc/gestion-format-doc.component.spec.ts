import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionFormatDocComponent } from './gestion-format-doc.component';

describe('GestionFormatDocComponent', () => {
  let component: GestionFormatDocComponent;
  let fixture: ComponentFixture<GestionFormatDocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionFormatDocComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionFormatDocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
