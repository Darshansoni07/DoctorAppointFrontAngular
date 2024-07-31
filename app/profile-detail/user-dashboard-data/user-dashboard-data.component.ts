import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import flatpickr from 'flatpickr';
import { startWith, switchMap, catchError, of, map } from 'rxjs';
import { AppointmentService } from 'src/app/service/appointment.service';
import { UserAccountService } from 'src/app/service/user-account.service';

@Component({
  selector: 'app-user-dashboard-data',
  templateUrl: './user-dashboard-data.component.html',
  styleUrls: ['./user-dashboard-data.component.css']
})
export class UserDashboardDataComponent implements OnInit {

  pageIndex: number = 0;
  pageSize: number = 5;
  currentPage = 0;
  showModal:boolean=false;
  updateForm!:FormGroup;
  appointmentId:any;

  totalBooked:any;
  totalChecked:any;
  totalPending:any;
  totalList:any;
  totalCancel:any;

  dataMat!: MatTableDataSource<any>;
  totalItem: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalData: any;

  pageS = [3, 5, 7];
  constructor(
    private appointService:AppointmentService,
    private userService:UserAccountService,
    private fb: FormBuilder) { }


  ngAfterViewInit() {
    debugger
    //this.dataMat.paginator = this.paginator;

    console.log(this.paginator.pageIndex, this.paginator.pageSize);
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.getTableData$(
            this.paginator.pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => {
            return of(null);
          }));
        }),
        map((empData: any) => {
          if (empData == null) return [];
          debugger;
          console.log(empData);
          this.totalItem = empData.totalUpcomingData;
          this.totalBooked = empData.totalBooked;
          this.totalChecked = empData.totalChecked;
          this.totalPending = empData.totalPending;
          this.totalList = empData.totalData;
          this.totalCancel = empData.totalCancel
          

          this.totalData = empData.data;
          return empData.data;
        })
      )
      .subscribe((empData:any) => {
        debugger
        this.dataMat = new MatTableDataSource(empData);
        this.dataMat.sort = this.sort;
      });
  }


  getTableData$(pageNumber: number, pageSize: number) {
    const data= this.userService.loadCurrentUser();
    const userId = data?.nameid;
    debugger    
    return this.userService.paitentGetUpcomingAppointment(userId,pageNumber, pageSize);
  }

  ngOnInit(): void {
    //this.loadFunction();
  }


  onSelectGetAppointmentData(AppointId:any){

    this.showModal = true;
    this.appointService.getAppointmentById(AppointId).subscribe(resp=>
      {
        resp.appointmentTime= this.reverseFormatDateTime(resp.appointmentTime);
        this.onSelectUpdateAppointmentData(resp);        
       
      });
  }

  //----------------update appointment by doctor
  updateOnSelect(){   
    debugger
    if(this.updateForm.valid){
      const selecteddate = this.updateForm.value;
      selecteddate.appointmentTime = this.formatDateTime(selecteddate.appointmentTime);     
      this.appointService.updateAppointmentStatus(this.appointmentId,this.updateForm.value).subscribe(resp=>{
        this.ngAfterViewInit();
      });
    }
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
      appointmentTime:data.appointmentTime,
      medicalHistorDescription:[''] 
    });                
  }

  //---------------------Time Formater
  formatDateTime(dateTimeString: string):string{
    const [date, time] = dateTimeString.split(' ');
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }
  //-------------------Time Formate 
  reverseFormatDateTime(dateTimeString:string) {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  closeModal(){
    this.showModal=false;
  }


}