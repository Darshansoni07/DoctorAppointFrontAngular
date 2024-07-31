import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { DoctorService } from 'src/app/service/doctor.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css']
})
export class DoctorDashboardComponent implements OnInit {

  userCurrentData: any;
  nameId: any;
  email: any;
  Name: any;
  userDetail: any;
  userId: any;
  profileApprove: boolean=false;
  role: any;
  DoctorName: any;
  assistantDoctor:any;
  UserProfile:any;

  constructor(private userService: UserAccountService,
    private adminService: AdminAccountService,
    private doctorService: DoctorService,
    private route: Router) { }

  ngOnInit(): void {
    this.loadUser();
    this.doctorApprove();
  }

  doctorApprove() {
    debugger;
    var Id = this.userService.loadCurrentUser();

    this.userId = Id?.nameid;
    if (this.userId && Id?.role == "Doctor") {
      debugger
      this.doctorService.doctorProfileApprove(this.userId).subscribe((resp) => {
        debugger
        if (resp == "approved") {
          this.profileApprove = true;
        }
        else if (resp == "not Found"){
          Swal.fire({
            title: 'You will have to fill doctor register form for access dashboard',
            text: 'This action cannot be undone',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Fill the Form'
          }).then((result) => {
            if (result.isConfirmed) {
              this.route.navigate(["/docAppoint/profile"]);
            }
          });
        }
        else if (resp == "doctor found but not approved") {
          Swal.fire({
            icon: 'warning',
            title: 'Profile Pending Approval',
            text: 'Your profile is pending for approval at Admin side',
            showConfirmButton: false,
            timer: 4000 // Close alert after 3 seconds
          });
        }
      });
    }
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
      });

    const metaID = this.doctorService.getMetaId();
    if (metaID && this.role=='Assistant') {
      this.doctorService.assistantGetDoctorDetails(metaID).subscribe((res) => {
        debugger
       this.assistantDoctor = res;
        console.log("message Dta", res);
      });
    }

  }
}