import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { UserAccountService } from 'src/app/service/user-account.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userForm!: FormGroup;
  userCurrentData: any;
  nameId: any;
  userDetail: any;
  doctorDetail: any;
  doctorMsg: any;
  SubmitCheck: boolean = false;
  metaId: any;
  role: any;
  dateformate:any;
  
  selectedFile: File | undefined;

  constructor(private userService: UserAccountService,
    private adminService: AdminAccountService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.initForm();
    this.loadFunction();
  }

  initForm() {
    this.userForm = this.fb.group({
      user_Id: ['', Validators.required],
      first_Name: ['', Validators.required],
      last_Name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      profile_Img:this.selectedFile,
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      medicalHistorDescription: [''],
      address: ['']
    });
  }

  loadFunction() {
    this.loadUser();
    flatpickr('.flatpickr', {
      dateFormat: 'Y-m-d',
    });
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
        this.userData();
      });

    //console.log(this.nameId);
  }

  userData() {
    if (this.userDetail) {
      if(this.userDetail.dob){
        const dateParts = this.userDetail.dob.split('-');
        const year = dateParts[0];
        const month = dateParts[1];
        const day = dateParts[2].substring(0, 2);
        this.dateformate = `${year}-${month}-${day}`;
      }
      this.userForm.patchValue({
        user_Id: this.nameId,
        first_Name: this.userDetail.first_Name,
        last_Name: this.userDetail.last_Name,
        email: this.userDetail.email,
        phoneNumber: this.userDetail.phoneNumber,
        dob: this.dateformate,
        gender: this.userDetail.gender,
        medicalHistorDescription: this.userDetail.medicalHistorDescription,
        address: this.userDetail.address,
        profile_Img: this.userDetail.profile_Img
      });
    }
  }


  onFileChange(event:any){
    debugger;
    let filereader  = new FileReader();   
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      filereader.readAsDataURL(file);
      this.selectedFile = file;
      filereader.onload = () => {
        this.userForm.patchValue({
          profile_Img: filereader.result
        });      
      };
    } 
  }

  onSubmit() {
    debugger;
    if (this.userForm.valid) {
      this.userService.updateUser(this.userForm.value).subscribe((res) => {
        Swal.fire('Success', 'Update successfly', 'success');
        console.log(res);
        this.loadUser();
      },(error)=>{
        console.log(error);
        Swal.fire('Error', 'You have enter worng details', 'error');
      });
      console.log(this.userForm.value);
    }
    else{
      Swal.fire('Error', 'You have not enter details', 'error');
    }
  }


}