import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploiTempsComponent } from './emploi-temps.component';

describe('EmploiTempsComponent', () => {
  let component: EmploiTempsComponent;
  let fixture: ComponentFixture<EmploiTempsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploiTempsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploiTempsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
