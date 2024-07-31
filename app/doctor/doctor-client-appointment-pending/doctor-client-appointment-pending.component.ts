import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { startWith, switchMap, catchError, of, map } from 'rxjs';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { AppointmentService } from 'src/app/service/appointment.service';
import { DoctorService } from 'src/app/service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-client-appointment-pending',
  templateUrl: './doctor-client-appointment-pending.component.html',
  styleUrls: ['./doctor-client-appointment-pending.component.css']
})
export class DoctorClientAppointmentPendingComponent implements OnInit {

  pageIndex: number = 0;
  pageSize: number = 5;
  currentPage = 0;
  showModal:boolean=false;
  updateForm!:FormGroup;
  appointmentId:any;

  dataMat!: MatTableDataSource<any>;
  totalItem: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalData: any;

  pageS = [3, 5, 7];

  constructor(private appointService:AppointmentService,
    private adminService:AdminAccountService,
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
            console.log("Paitent Pending data:",empData);
            this.totalItem = empData.totalData;
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
      debugger    
      return this.appointService.getAllPendingAppointment(pageNumber, pageSize);
    }
  

  ngOnInit(): void {
  }

  onSelectPendingAppointId(AppointId: any)
  {
    Swal.fire({
      title: 'Are you sure you want to approve this Appointmen?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        this.appointService.approvePendingRequestAppoint(AppointId).subscribe(res=>{
          if (res == "Appointment Approved") {
            this.ngAfterViewInit();
            Swal.fire(
              'Approved!',
              'The appointment has been approved.',
              'success'
            );
          }
       });
      }
    });
  }


  OnSelectUserDetailsById(UserId:any)
  {
    if(UserId){
      this.adminService.getClientById(UserId).subscribe((resp)=>{ 
        
        let reportDetailsHtml = '<div>';
        
        reportDetailsHtml += `<div>Name : ${resp.first_Name} ${resp.last_Name}</div>
        Gender : ${resp.gender} <br>
        DOB : ${this.reverseFormatDateTime(resp.dob)}<br>
        Contact Number : ${resp.phoneNumber}<br>
        Email : ${resp.email}<br>
        Address : ${resp.address} `;
        
        reportDetailsHtml += '</div>';

        Swal.fire({
          title: 'User Details',
          html: reportDetailsHtml,
          // showCancelButton: true,
          // showConfirmButton: true,
          // confirmButtonText: 'Report Download',
          // cancelButtonText: 'Close'
        }).then((result) => {
          if (result.isConfirmed) {
            
          } 
          else if(result.dismiss === Swal.DismissReason.cancel){
            
          }
        });
      },
      (error)=>{
        console.log(error);
      }      
      );
    }
    else{

    }
  }



   //-------------------Time Formate 
   reverseFormatDateTime(dateTimeString:string) {
    const [datePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}-${month}-${year}`;
  }

}
