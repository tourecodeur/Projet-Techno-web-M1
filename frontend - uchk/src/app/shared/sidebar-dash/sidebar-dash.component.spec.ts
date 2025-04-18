import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarDashComponent } from './sidebar-dash.component';

describe('SidebarDashComponent', () => {
  let component: SidebarDashComponent;
  let fixture: ComponentFixture<SidebarDashComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarDashComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarDashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
