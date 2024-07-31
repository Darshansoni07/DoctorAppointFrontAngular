import { Component, OnInit } from '@angular/core';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { UserAccountService } from 'src/app/service/user-account.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  userCurrentData: any;
  nameId: any;
  email: any;
  Name: any;
  userDetail: any;
  userId: any;
  profileApprove: boolean=false;
  role: any;
  UserProfile:any;

  constructor(private userService: UserAccountService,
    private adminService: AdminAccountService) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser() {
    debugger
    this.userCurrentData = this.userService.loadCurrentUser();
    this.nameId = this.userCurrentData.nameid;
    this.email = this.userCurrentData.email;
    this.Name = this.userCurrentData.unique_name;
    this.role = this.userCurrentData.role;

    this.adminService.getClientById(this.nameId).subscribe(
      respo => {
        this.userDetail = respo;
        this.UserProfile = respo.profile_Img;        
        this.nameId = respo.user_Id;
        console.log(respo);
      });    

  }

}
