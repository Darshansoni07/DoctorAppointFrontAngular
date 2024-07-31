import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { DoctorService } from 'src/app/service/doctor.service';
import { MainpageService } from 'src/app/service/mainpage.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-doctor-form',
  templateUrl: './user-doctor-form.component.html',
  styleUrls: ['./user-doctor-form.component.css']
})
export class UserDoctorFormComponent implements OnInit {

  doctorMetaForm!: FormGroup;
  userCurrentData: any;
  nameId: any;
  userDetail: any;
  doctorDetail: any;
  doctorMsg: any;
  SubmitCheck: boolean = false;
  metaId: any;
  role: any;

  constructor(private userService: UserAccountService,
    private adminService: AdminAccountService,
    private doctorService: DoctorService,
    private fb: FormBuilder,
    private mainpageService: MainpageService) { }

  ngOnInit(): void {
    this.loadFunction();
    this.doctorMetaForm = this.fb.group({
      UserDetailsUser_Id: [''],
      Specialist: ['', Validators.required],
      License: ['', Validators.required],
      FeesAmount: ['']
    });
  }

  loadFunction() {
    this.loadUser();
    this.checkDoctor();
  }

  checkDoctor() {
    //this.loadUser();
    debugger;
    if (this.userService.getRole() == "Doctor") {
      
      this.doctorMsg = this.doctorService.doctorProfileApprove(this.nameId).subscribe(res => {
        debugger;
        if (res == "not Found") {
          Swal.fire({
            icon: 'error',
            title: 'You Have Not Filled Doctor Information Form',
            text: 'Please fill out your information',
            showConfirmButton: false,
            timer: 4000 // Close alert after 3 seconds
          });
        }
        // else if (res == "doctor found but not approved") {
        //   Swal.fire({
        //     icon: 'warning',
        //     title: 'Profile Pending Approval',
        //     text: 'Your profile is pending for approval at Admin side',
        //     showConfirmButton: false,
        //     timer: 4000 // Close alert after 3 seconds
        //   });
        // }
        else if (res == "approved" || res == "doctor found but not approved") {
          if (this.nameId) {
            this.mainpageService.getDoctorById(this.nameId).subscribe((resp) => {
              console.log(resp);
              this.doctorDetail = resp;
              this.doctorMetaData();
              this.SubmitCheck = true;
            });
          }
        }
      });
    }

  }

  loadUser() {
    debugger
    this.userCurrentData = this.userService.loadCurrentUser();
    this.role = this.userCurrentData.role;
    this.nameId = this.userCurrentData.nameid;
    this.adminService.getClientById(this.nameId).subscribe(
      (respo) => {
        console.log("userData:", respo);
        this.userDetail = respo;
        this.nameId = respo.user_Id;
      });
    //console.log(this.nameId);
  }

  doctorMetaData() {
    
    this.userCurrentData = this.userService.loadCurrentUser();
    this.nameId = this.userCurrentData.nameid;
    if (this.doctorDetail) {
      debugger
      const specialist = this.doctorDetail.specialist || '';
      const license = this.doctorDetail.license || '';
      this.doctorMetaForm.patchValue({
        UserDetailsUser_Id: this.nameId,
        Specialist: specialist,
        License: license,
        FeesAmount: this.doctorDetail.feesAmount
      });
    }
  }

  onSubmit() {
    debugger;
    if (this.doctorMetaForm.valid) {
      this.doctorMetaForm.value.UserDetailsUser_Id = this.nameId;
      this.userService.postDoctorMetaData(this.doctorMetaForm.value).subscribe(repo => {
        if(repo=="SuccessFully send to doctor Request"){
          Swal.fire('Success','You have successfully filled pending form admin side for approval','success');
        }
        else{
          Swal.fire('Error', 'Form Not filled something error', 'error');
        }
      },(error)=>{
        console.log(error);
      }
      );
      this.doctorMetaForm.reset();
    }
  }

  OnUpdate() {
    this.metaId = this.doctorDetail.doc_meta_Id;
    console.log(this.metaId);
  }


  get Specialist() {
    return this.doctorMetaForm.get('Specialist');
  }

  get License() {
    return this.doctorMetaForm.get('License');
  }

  get FeesAmount() {
    return this.doctorMetaForm.get('FeesAmount');
  }

}
