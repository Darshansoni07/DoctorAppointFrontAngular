import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import flatpickr from 'flatpickr';
import { AppointmentService } from 'src/app/service/appointment.service';
import { DoctorService } from 'src/app/service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-activities-appointment',
  templateUrl: './doctor-activities-appointment.component.html',
  styleUrls: ['./doctor-activities-appointment.component.css']
})
export class DoctorActivitiesAppointmentComponent implements OnInit {

   
  slicedPendApointsData: any[] = [];
  approvedAppointmentData: any[]=[];
  appointId:any;
  showModal: boolean =false;
  updateForm!:FormGroup;
  appointmentId:any;

  constructor(private doctorService:DoctorService,
    private appointService:AppointmentService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loadMethod();
    flatpickr('.flatpickr', {
      enableTime: true, // Enable time picker
      dateFormat: 'Y-m-d H:i', // Date and time format      
      minDate: 'today', // Set the minimum date and time to today
    });
  }

  loadMethod(){
    this.getAllApprovedAppointmentData();
  }

  //------------------------ Get All Approve Appointment Where match with current time
  getAllApprovedAppointmentData(){
    this.appointService.getAllTodayAppointment().subscribe(res=>{
      this.approvedAppointmentData = res;
    });
  }




  //---------------------------- Get Appointment by Id
  onSelectGetAppointmentData(AppointId:any){
    this.showModal = true;
    this.appointService.getAppointmentById(AppointId).subscribe(resp=>
      {
        resp.appointmentTime= this.reverseFormatDateTime(resp.appointmentTime);
        this.onSelectUpdateAppointmentData(resp);
        
       
        console.log(resp);
      });
  }

  //-------------------------- Update Appointment By Id
  onSelectUpdateAppointmentData(data:any){ 
    
    flatpickr('.flatpickr',{
      enableTime: true, 
      dateFormat: 'Y-m-d H:i',      
      minDate: 'today', 
    });
    this.appointmentId = data.appointment_Id;
    this.updateForm = this.fb.group({
      status:data.status, 
      appointmentTime:data.appointmentTime     
    });  
              
  }

  //----------------update appointment by doctor
  updateOnSelect(){   
    if(this.updateForm.valid){
      const selecteddate = this.updateForm.value;
      selecteddate.appointmentTime = this.formatDateTime(selecteddate.appointmentTime);   
      console.log(this.updateForm.value);
      console.log(this.appointmentId);
      this.appointService.updateAppointmentStatus(this.appointmentId,this.updateForm.value).subscribe(resp=>{
        console.log(resp);
        this.getAllApprovedAppointmentData();
      });
    }
  }

  closeModal(){
    this.showModal=false;
  }

  //-------------------Time Formate 
  reverseFormatDateTime(dateTimeString:string) {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  //---------------------Time Formater
  formatDateTime(dateTimeString: string):string{
    const [date, time] = dateTimeString.split(' ');
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }
}
