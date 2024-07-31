import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { DoctorService } from 'src/app/service/doctor.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile-sidebar',
  templateUrl: './user-profile-sidebar.component.html',
  styleUrls: ['./user-profile-sidebar.component.css']
})
export class UserProfileSidebarComponent implements OnInit {
  
  userCurrentData:any;
  nameId:any;
  userDetail : any;
  doctorDetail:any;
  doctorMsg:any;

  constructor(private userService:UserAccountService, 
    private adminService:AdminAccountService,
    ) { }

  ngOnInit(): void {
    this.loadUser();  
  }  

  loadUser(){
    debugger
    this.userCurrentData = this.userService.loadCurrentUser(); 
    this.nameId =this.userCurrentData.nameid;
    this.adminService.getClientById(this.nameId).subscribe(
      respo=>{
        this.userDetail = respo; 
        this.nameId = respo.user_Id;
    });
  } 
}