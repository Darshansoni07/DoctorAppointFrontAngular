import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import flatpickr from 'flatpickr';
import { AppointmentService } from 'src/app/service/appointment.service';
import { DoctorService } from 'src/app/service/doctor.service';

@Component({
  selector: 'app-doctor-dashboard-data',
  templateUrl: './doctor-dashboard-data.component.html',
  styleUrls: ['./doctor-dashboard-data.component.css']
})
export class DoctorDashboardDataComponent implements OnInit {

  appointmentUserData:any[]=[];
  metaId :any;
  showModal: boolean =false;
  updateForm!:FormGroup;
  appointmentId:any;
  totalChecked:number=0;
  totalIncome:number=0;


  constructor(private appointService:AppointmentService,
    private fb: FormBuilder) { }

  ngOnInit(): void {    
    this.getAllAppointmentUserData();
  }

 
  getAllAppointmentUserData(){
    this.appointService.getAllApprovedAppointment(0,1).subscribe((res:any)=>{
      this.totalIncome = res.totalAppointment*res.feesAmount;
      this.totalChecked = res.totalAppointment;
    });
  }

}