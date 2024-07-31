import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DoctorService } from 'src/app/service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-assistant-register',
  templateUrl: './doctor-assistant-register.component.html',
  styleUrls: ['./doctor-assistant-register.component.css']
})
export class DoctorAssistantRegisterComponent implements OnInit {

  registerForm!: FormGroup;
  metaId: any;
  userSubmitted!: boolean; 
  
  constructor(private fb: FormBuilder, private doctorservice:DoctorService) { }

  ngOnInit(): void {
    this.createRegisterationForm();
  }


  createRegisterationForm(){
    this.metaId = localStorage.getItem("MetaDataId");
    debugger;
    this.registerForm = this.fb.group({
      First_Name: new FormControl(null, Validators.required),
      Last_Name: new FormControl(null, Validators.required),
      Email: new FormControl(null, [Validators.required, Validators.email]),
      PhoneNumber: new FormControl(null, Validators.required),
      MetadataDoc_meta_Id:this.metaId,   
      Password: new FormControl(null, [Validators.required, Validators.minLength(8)])            
    });
  }


  OnSubmit(){
    debugger;
    this.metaId = localStorage.getItem("MetaDataId");

    this.userSubmitted = true;

    if(this.registerForm.valid)
    {
      debugger;
      const userData = this.registerForm.value;
      this.doctorservice.createAssistant(userData).subscribe(res=>
        {
          if(res == "SuccessFull Register"){
            Swal.fire('Success', 'You have Successfully register assistant wait verfiy admin side panel', 'success');
          }
          else{
            if(res=="This Email is Already Exsist"){
              Swal.fire('Error', 'You Have Already Register form this mail Id', 'error');              
            }
            Swal.fire('Error', 'You not register please enter the details properly', 'error');
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
  get PhoneNumber(){
    return this.registerForm.get('PhoneNumber') as FormControl;
  }

}
