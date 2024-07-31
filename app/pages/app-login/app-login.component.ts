import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from 'src/app/service/doctor.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-app-login',
  templateUrl: './app-login.component.html',
  styleUrls: ['./app-login.component.css']
})
export class AppLoginComponent implements OnInit {

  message: string = '';
  userSubmitted!: boolean;
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private accountService: UserAccountService,
    private router: Router,
    private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.loginUserForm();
  }

  loginUserForm() {
    debugger;
    this.loginForm = this.fb.group({
      Email: new FormControl(null, Validators.required),
      Password: new FormControl(null, Validators.required)
    });
  }


  onSubmit() {

    debugger;


    if (this.loginForm.valid) {
      debugger;
      const userData = this.loginForm.value;

      this.accountService.loginUser(userData).subscribe(res => {
        debugger;
        if (res == "Your email is not Verify or email id and passward wrong") {
          Swal.fire('Error', 'Your email is not Verify or email id and passward wrong', 'error');
        }
        if (res) {
          const responseObject = JSON.parse(res);
          console.log(responseObject);
          const token = responseObject.token;
          this.accountService.setToken(token);
          const data = this.accountService.loadCurrentUser();
          debugger;
          const getRoles = localStorage.getItem('user_Role');
          if (getRoles === "Admin") {
            this.router.navigate(["/admin/dashboard"]);
          }
          if (getRoles === "Client") {
            this.router.navigate(["/dashboard/data"]);
          }
          if (getRoles === "Doctor") {
            this.doctorService.doctorMetaDataById(data?.nameid).subscribe(resp => {
              if (resp) {
                debugger
                localStorage.setItem("MetaDataId", resp.doc_meta_Id);
                this.router.navigate(["/doctor/dashboard"]);
              }
            },(error)=>{
              this.router.navigate(["/doctor/dashboard"]);
              console.log(error);
            });
          }
          if (getRoles == "Assistant") {

            this.accountService.assistantDoctorMap(data?.email).subscribe((resp) => {
              debugger
              console.log("data response:", resp);
              localStorage.setItem("MetaDataId", resp.doctorMetadataDoc_meta_Id);
              this.router.navigate(["/doctor/dashboard"]);
            })

          }
          //localStorage.setItem("access_token",responseObject.token);
          this.message = "User Have SuccessFully Login";
          Swal.fire('Success', 'Login SuccessFully', 'success');
        }
        else {
          Swal.fire('Error', 'Your email is not Verify or email id and passward wrong', 'error');
        }
      }, (error) => {
        Swal.fire('Error', 'Your email is not Verify or email id and passward wrong', 'error');
        console.error(error);
      }
      );
      this.loginForm.reset();
      this.userSubmitted = false;
    }

  }

  get Email() {
    return this.loginForm.get('Email') as FormControl;
  }

  get Password() {
    return this.loginForm.get('Password') as FormControl;
  }

}