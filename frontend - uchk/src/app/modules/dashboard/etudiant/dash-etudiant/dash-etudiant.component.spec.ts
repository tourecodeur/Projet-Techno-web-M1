import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashEtudiantComponent } from './dash-etudiant.component';

describe('DashEtudiantComponent', () => {
  let component: DashEtudiantComponent;
  let fixture: ComponentFixture<DashEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashEtudiantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
