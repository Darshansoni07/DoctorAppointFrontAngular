import { Component, OnInit } from '@angular/core';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { DoctorService } from 'src/app/service/doctor.service';
import { UserAccountService } from 'src/app/service/user-account.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  roles: any;
  userLoggedIn: boolean = false;
  userId: any;
  email: any;
  firstName: any;
  profileApprove: boolean = false;
  msgProfile: any;
  assistantMetaId: any;
  UserProfileImg:any;
  constructor(private userService: UserAccountService,
    private doctorService: DoctorService,
    private adminService:AdminAccountService) { }


  ngOnInit(): void {
    this.isLoggedIn();
    this.doctorApprovalCheck();
  }

  doctorApprovalCheck() {
    var Id = this.userService.loadCurrentUser();
    this.userId = Id?.nameid;
    this.email = Id?.email;
    this.firstName = Id?.unique_name;

    if (this.userId) {

      this.adminService.getClientById(Id?.nameid).subscribe(
        (respo) => {
          this.UserProfileImg = respo.profile_Img;
        });
      if (Id?.role == "Doctor") {
        this.msgProfile = this.doctorService.doctorProfileApprove(this.userId).subscribe((resp) => {
          if (resp == "approved") {
            this.profileApprove = true;
          }
        });
        this.doctorService.doctorMetaDataById(this.userId).subscribe(resp => {
          if (resp) {
            localStorage.setItem("MetaDataId", resp.doc_meta_Id);
          }
        });
      }
      if (Id?.role == 'Assistant') {
        this.userService.assistantDoctorMap(Id?.email).subscribe((resp) => {
          debugger;
          this.assistantMetaId = resp.doctorMetadataDoc_meta_Id;
          localStorage.setItem("MetaDataId", resp.doctorMetadataDoc_meta_Id);
        });

      }
    }
  }

  isLoggedIn() {
    debugger;
    this.roles = localStorage.getItem("user_Role");
    const token = this.userService.isLoggedIn();
    this.userLoggedIn = token;
  }

  Logout() {
    localStorage.clear();
  }

}
