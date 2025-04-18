import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesDiplomesComponent } from './mes-diplomes.component';

describe('MesDiplomesComponent', () => {
  let component: MesDiplomesComponent;
  let fixture: ComponentFixture<MesDiplomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesDiplomesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesDiplomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
