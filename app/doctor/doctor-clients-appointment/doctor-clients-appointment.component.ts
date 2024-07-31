import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { AppointmentService } from 'src/app/service/appointment.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-clients-appointment',
  templateUrl: './doctor-clients-appointment.component.html',
  styleUrls: ['./doctor-clients-appointment.component.css']
})
export class DoctorClientsAppointmentComponent implements OnInit {

  approvedAppointmentData: any[] = [];
  appointId: any;
  showModal: boolean = false;
  updateForm!: FormGroup;
  appointmentId: any;
  pageIndexAA: number = 0;
  pageSizeAA: number = 5;
  totalpage: number = 0;

  constructor(private appointService: AppointmentService,
    private adminService: AdminAccountService,
    private fb: FormBuilder, private route : Router) { }

  ngOnInit(): void {
    this.loadMethod();
    flatpickr('.flatpickr', {
      enableTime: true, // Enable time picker
      dateFormat: 'Y-m-d H:i', // Date and time format      
      minDate: 'today', // Set the minimum date and time to today
    });
  }

  loadMethod() {
    this.getAllApprovedAppointmentData();
  }

  //------------------------ Get All Approve Appointment Where match with current time
  getAllApprovedAppointmentData() {
    this.appointService.getAllApprovedAppointment(this.pageIndexAA, this.pageSizeAA).subscribe((res: any) => {
      console.log("Dataappointment", res);
      this.approvedAppointmentData = res.data;
      this.totalpage = res.totalData;
    });
  }

  //---------------------------- Get Appointment by Id
  onSelectGetAppointmentData(AppointId: any) {
    this.showModal = true;
    this.appointService.getAppointmentById(AppointId).subscribe(resp => {
      resp.appointmentTime = this.reverseFormatDateTime(resp.appointmentTime);
      this.onSelectUpdateAppointmentData(resp);
    });
  }

  //-------------------------- Update Appointment By Id
  onSelectUpdateAppointmentData(data: any) {
    flatpickr('.flatpickr', {
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      minDate: 'today',
    });
    this.appointmentId = data.appointment_Id;
    this.updateForm = this.fb.group({
      status: data.status,
      appointmentTime: data.appointmentTime,
      BP: data.bp,
      HeartRate: data.heartRate,
      Sugar: data.sugar,
      Description: data.description,
      Medicine: data.medicine
    });
  }

  //----------------update appointment by doctor
  updateOnSelect() {
    if (this.updateForm.valid) {
      const selecteddate = this.updateForm.value;
      selecteddate.appointmentTime = this.formatDateTime(selecteddate.appointmentTime);

      this.appointService.updateAppointmentStatus(this.appointmentId, this.updateForm.value).subscribe(resp => {
        this.getAllApprovedAppointmentData();
      });
    }
  }

  OnSelectReportData(FileName: any) {
    this.appointService.getDownload(FileName).subscribe(
      (response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      (error) => {
        console.error('Error fetching PDF:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch PDF!',
        });
      }
    );
  }

  Download(FileName: any) {
    this.appointService.getDownload(FileName).subscribe(
      (blob: Blob) => {
        const blob1 = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob1);
        const link = document.createElement('a');
        link.href = url;
        link.download = FileName + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading report:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to download report!',
        });
      }
    );
  }

  OnSelectUserDetailsById(UserId: any) {
    debugger
    if (UserId) {
      this.adminService.getClientById(UserId).subscribe((resp) => {
        debugger
        let reportDetailsHtml = '<div>';

        reportDetailsHtml += `<div>Name : ${resp.first_Name} ${resp.last_Name}</div>
        Gender : ${resp.gender} <br>
        DOB : ${this.reverseFormatDateTimedob(resp.dob)}<br>
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
          else if (result.dismiss === Swal.DismissReason.cancel) {

          }
        });
      },
        (error) => {
          console.log(error);
        }
      );
    }
    else {

    }
  }

  getUserDetailById(Id:any)
  {
    this.route.navigate(['/doctor/patientinfo', Id]);
  }

  closeModal() {
    this.showModal = false;
  }

  //-------------------Time Formate 
  reverseFormatDateTimedob(dateTimeString: string | null) {
    if(dateTimeString){
    const [datePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    return `${day}-${month}-${year}`;
    }
    else 
    {
      return "";
    }
  }
  //-------------------Time Formate 
  reverseFormatDateTime(dateTimeString: string | null) {
    debugger
    if (dateTimeString) {
      const [datePart, timePart] = dateTimeString.split('T');
      const [year, month, day] = datePart.split('-');
      const [hours, minutes] = timePart.split(':');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    else{
      return null;
    }

  }

  //---------------------Time Formater
  formatDateTime(dateTimeString: string): string {
    const [date, time] = dateTimeString.split(' ');
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }


  onPageChange(pageIndex: number) {
    if (pageIndex >= 0) {
      this.pageIndexAA = pageIndex;
      this.getAllApprovedAppointmentData();
    }
  }

  getPaginationIndices() {
    const totalPages = Math.ceil(this.approvedAppointmentData.length / this.pageSizeAA);
    return Array.from(Array(totalPages).keys());
  }

  onNextButtonClick() {
    if (!this.isNextButtonDisabled()) {
      this.onPageChange(this.pageIndexAA + 1);
    }
  }

  isNextButtonDisabled(): boolean {
    const totalPages = Math.ceil(this.totalpage / this.pageSizeAA);
    return this.pageIndexAA >= totalPages - 1;
  }


}
