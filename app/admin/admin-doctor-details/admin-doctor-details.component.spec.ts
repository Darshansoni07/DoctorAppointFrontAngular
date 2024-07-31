import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDoctorDetailsComponent } from './admin-doctor-details.component';

describe('AdminDoctorDetailsComponent', () => {
  let component: AdminDoctorDetailsComponent;
  let fixture: ComponentFixture<AdminDoctorDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDoctorDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDoctorDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
