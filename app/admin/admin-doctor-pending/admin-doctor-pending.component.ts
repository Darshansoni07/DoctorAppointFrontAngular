import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-doctor-pending',
  templateUrl: './admin-doctor-pending.component.html',
  styleUrls: ['./admin-doctor-pending.component.css']
})
export class AdminDoctorPendingComponent implements OnInit {

  updateForm!: FormGroup;
  totalItems = 0;
  pageIndex: number = 0;
  pageSize: number = 5;
  ClientData: any[] = [];
  totalpage:number=0;

  userCurrentData: any;
  clientId: any;

  constructor(private admin_Service: AdminAccountService) { }

  ngOnInit(): void {
    this.methodsActivate();
  }


  
  methodsActivate() {
    this.getAllCilent();
  }

  //------------------Get All Client Data
  getAllCilent() {
    debugger
    this.admin_Service.getDoctorForApprove(this.pageIndex, this.pageSize).subscribe((res:any) => {
      this.ClientData = res.data;
      this.totalItems = res.totalData;
      this.totalpage = res.totalData;
      console.log("data",res);
    },
      (error) => {
        console.log(error);
      });
  }


  //--------------------------Approve Doctor by Id 
  getApprovedDoctor(id: any) {
    debugger
    Swal.fire({
      title: 'Are you sure you want to approve this doctor?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        this.admin_Service.postApproveDoctorById(id).subscribe(rep => {
          console.log(rep);
          if (rep == "Approved") {
            this.getAllCilent();
            Swal.fire(
              'Approved!',
              'The doctor has been approved.',
              'success'
            );
            // You can add any additional logic here after approval
          }
        });
      }
    });
  }

  
  
  onPageChange(pageIndex: number) {
    if (pageIndex >= 0) {
      this.pageIndex = pageIndex;
      this.getAllCilent();
    }
  }

  getPaginationIndices() {
    const totalPages = Math.ceil(this.ClientData.length / this.pageSize);
    return Array.from(Array(totalPages).keys());
  }

  onNextButtonClick() {
    if (!this.isNextButtonDisabled()) {
        this.onPageChange(this.pageIndex + 1);
    }
}

isNextButtonDisabled(): boolean {
    const totalPages = Math.ceil(this.totalpage / this.pageSize);
    return this.pageIndex >= totalPages - 1;
}

  

}