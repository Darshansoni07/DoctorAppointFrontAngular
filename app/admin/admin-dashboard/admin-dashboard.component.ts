import { Component, OnInit } from '@angular/core';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  Name : any;
  Roles : any;
  ClientData : any[] =[];
  DoctorRequest : any[] =[];

  constructor(private account_Service:UserAccountService,
    private admin_Service : AdminAccountService) { }

  ngOnInit(): void {
    this.AdminFunction();
  }

  AdminFunction(){
    this.Name =this.account_Service.loadCurrentUser();
    this.Roles=localStorage.getItem('user_Role');  
  }

  

  Logout(){
    localStorage.clear();
  }

}
