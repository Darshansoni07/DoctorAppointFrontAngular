import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { UserAccountService } from 'src/app/service/user-account.service';

@Component({
  selector: 'app-admin-doctor-list',
  templateUrl: './admin-doctor-list.component.html',
  styleUrls: ['./admin-doctor-list.component.css']
})
export class AdminDoctorListComponent implements OnInit {

  updateForm!: FormGroup;
  ClientData: any[] = [];
  showModal: boolean = false;
  totalpage:number=0;

  pageIndex: number = 0;
  pageSize: number = 5;

  userCurrentData: any;
  clientId: any;

  constructor(private account_Service: UserAccountService,
    private admin_Service: AdminAccountService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.methodsActivate();
    //this.createUpdate();    
  }


  createUpdate() {
    debugger;
    this.updateForm = this.fb.group({
      first_Name: this.userCurrentData.first_Name,
      last_Name: this.userCurrentData.last_Name,
      email: this.userCurrentData.email,
      phoneNumber: this.userCurrentData.phoneNumber
    });
  }

  methodsActivate() {
    this.getAllCilent();
  }

  //------------------Get All Client Data
  getAllCilent() {

    this.admin_Service.getAllApproveDoctor(this.pageIndex, this.pageSize).subscribe((res:any) => {
      this.ClientData = res.data;
      this.totalpage = res.totalData;      
    },
      (error) => {
        console.log(error);
      });
  }

  //----------------------Get Client data by Id
  onSelectById(Id: any) {
    debugger
    localStorage.setItem("UserId", Id);
    if (Id) {
      this.admin_Service.getClientById(Id).subscribe(
        res => {
          if (res) {
            debugger
            this.userCurrentData = res;
          }
          console.log(res);
          this.createUpdate();
          this.showModal = true;
        }
      );
    }
  }


  //---------------------------update User
  updateOnSelect() {
    debugger
    this.clientId = localStorage.getItem("UserId");
    if (this.updateForm.valid) {
      this.account_Service.updateUserById(this.clientId, this.updateForm.value).subscribe(resp => {
        console.log(resp);
      });

    }
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



  closeModal() {
    this.showModal = false;
  }



  get first_Name() {
    return this.updateForm.get('first_Name') as FormControl;
  }
  get phoneNumber() {
    return this.updateForm.get('phoneNumber') as FormControl;
  }
  get last_Name() {
    return this.updateForm.get('last_Name') as FormControl;
  }
  get email() {
    return this.updateForm.get('email') as FormControl;
  }
}
