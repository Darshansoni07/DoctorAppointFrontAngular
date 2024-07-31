import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-assistant-pending',
  templateUrl: './admin-assistant-pending.component.html',
  styleUrls: ['./admin-assistant-pending.component.css']
})
export class AdminAssistantPendingComponent implements OnInit {

  updateForm!: FormGroup;
  currentPage = 1;
  itemsPerPage = 5;
  totalItems = 0;
  ClientData: any[] = [];
  slicedData: any[] = [];
  showModal: boolean = false;
  DoctorRequest: any[] = [];

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
    this.getAllAssistant();
  }

  //------------------Get All Client Data
  getAllAssistant() {

   this.admin_Service.getAllPendingAssistant().subscribe(res => {
      this.ClientData = res;
      this.totalItems = this.ClientData.length;
      console.log(res);
      this.updateSlicedData();
    },
      (error) => {
        console.log(error);
      });
  }

  //----------------------Get Client data by Id
  onSelectById(Id: any) {
    debugger
    localStorage.setItem("UserId", Id);
    this.admin_Service.getClientById(Id).subscribe(
      res => {
        if (res) {
          debugger
          this.showModal = true;
          this.userCurrentData = res;
        }
        console.log(res);
      }
    );
    this.createUpdate();
    //console.log(this.MetaDataClient);
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


  //--------------------------Approve Doctor by Id 
  getApprovedAssistant(id: any) {
    debugger
    Swal.fire({
      title: 'Are you sure you want to approve this Assistant?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        this.admin_Service.assistantApproveById(id).subscribe(rep => {
          console.log(rep);
          if (rep == "Approved") {
            this.getAllAssistant();
            Swal.fire(
              'Approved!',
              'The Assistant has been approved. Please Check Mail For Verification',
              'success'
            );
            // You can add any additional logic here after approval
          }
        });
      }
    });
  }

 



  closeModal() {
    this.showModal = false;
  }

  //-----------------------Pagination update slice
  updateSlicedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.slicedData = this.ClientData.slice(startIndex, endIndex);
    console.log(this.slicedData);
  }

  //-------------------------- Next page
  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.totalItems) {
      this.currentPage++;
      this.updateSlicedData();
    }
  }

  //--------------------------- Pervious page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateSlicedData();
    }
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
