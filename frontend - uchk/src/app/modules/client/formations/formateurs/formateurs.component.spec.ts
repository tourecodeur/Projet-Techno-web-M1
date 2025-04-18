import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormateursComponent } from './formateurs.component';

describe('FormateursComponent', () => {
  let component: FormateursComponent;
  let fixture: ComponentFixture<FormateursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormateursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormateursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
