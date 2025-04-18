import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComptesRendusComponent } from './comptes-rendus.component';

describe('ComptesRendusComponent', () => {
  let component: ComptesRendusComponent;
  let fixture: ComponentFixture<ComptesRendusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComptesRendusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComptesRendusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
