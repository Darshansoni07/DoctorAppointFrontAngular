import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-app-register',
  templateUrl: './app-register.component.html',
  styleUrls: ['./app-register.component.css']
})
export class AppRegisterComponent implements OnInit {

  registerForm!: FormGroup;
  msg:string='';
  userSubmitted!:boolean;

  constructor(private fb: FormBuilder, private registerService:UserAccountService) { }

  ngOnInit(): void {
    this.createRegisterationForm();
  }

  

  createRegisterationForm(){
    debugger;
    this.registerForm = this.fb.group({
      First_Name: new FormControl(null, Validators.required),
      Last_Name: new FormControl(null, Validators.required),
      Email: new FormControl(null, [Validators.required, Validators.email]),
      PhoneNumber: new FormControl(null, Validators.required),
      roles_UserRole_Id:new FormControl(null, [Validators.required]),   
      Password: new FormControl(null, [Validators.required, Validators.minLength(8)])            
    });
  }

  OnSubmit(){
    debugger;
    this.userSubmitted = true;

    if(this.registerForm.valid)
    {
      debugger;
      const userData = this.registerForm.value;
      this.registerService.registerUser(userData).subscribe(res=>
        {
          if(res == "SuccessFull Register"){
            this.msg = "User have SuccessFully Register";
            Swal.fire('Success', 'You have Successfully register please verify your email', 'success');
          }
          else{
            if(res=="This Email of User Already Exsist"){
              Swal.fire('Error', 'You Have Already Register form this mail Id', 'error');              
            }
            Swal.fire('Error', 'You not register please enter the details properly', 'error');
            this.msg = "You are not register Please Enter the details Properly";
          }
        },(error)=>{
          console.error(error);
        }
        );
        this.registerForm.reset();
        this.userSubmitted=false;
    }        
  }


  get First_Name(){
    return this.registerForm.get('First_Name') as FormControl;
  }
  get Last_Name(){
    return this.registerForm.get('Last_Name') as FormControl;
  }
  get Password(){
    return this.registerForm.get('Password') as FormControl;
  }
  get Email(){
    return this.registerForm.get('Email') as FormControl;
  }
  get roles_UserRole_Id(){
    return this.registerForm.get('roles_UserRole_Id') as FormControl;
  }
  get PhoneNumber(){
    return this.registerForm.get('PhoneNumber') as FormControl;
  }

}
