import { Component, OnInit } from '@angular/core';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-dashboard-data',
  templateUrl: './admin-dashboard-data.component.html',
  styleUrls: ['./admin-dashboard-data.component.css']
})
export class AdminDashboardDataComponent implements OnInit {

  Name: any;
  Roles: any;
  ClientData: any[] = [];
  DoctorRequest: any[] = [];
  TotalPendingDoctor: number = 0;
  TotalPatient: number = 0;
  TotalApprovedDoctor: number = 0;
  TotalPendingAssistant: number = 0;
  TotalAssistant: number = 0;
  TotalIncome: number = 0;
  TotalAppoinmentBooked: number = 0;

  charLoaded: boolean = false;
  //---chart variable
  showLabels = true;
  explodeSlices = false;
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Sales';
  timeline = true;
  doughnut = true;
  public single: any[] = [];

  constructor(private account_Service: UserAccountService,
    private admin_Service: AdminAccountService) { }

  ngOnInit(): void {
    //this.AdminFunction();
    this.loadCharData();
  }


  loadCharData() {

    this.Name = this.account_Service.loadCurrentUser();
    this.Roles = localStorage.getItem('user_Role');

    this.admin_Service.getAllApproveDoctorCount().subscribe(
      (resApprovedDoctor: any[]) => {
        this.TotalApprovedDoctor = resApprovedDoctor.length;

        this.admin_Service.getDoctorForApprove(0,5).subscribe(
          (resPendingDoctor: any) => {
            this.DoctorRequest = resPendingDoctor.data;
            this.TotalPendingDoctor = resPendingDoctor.totalData;

            this.admin_Service.getAllAssistant(0, 1).subscribe(
              (resTotalAssistant: any) => {
                this.TotalAssistant = resTotalAssistant.totalCount;

                this.admin_Service.getAllPendingAssistant().subscribe(
                  (resPendingAssistant: any[]) => {
                    this.TotalPendingAssistant = resPendingAssistant.length;

                    this.admin_Service.getAllAppointmentDetail(0, 1).subscribe(
                      (resp: any) => {
                        this.TotalAppoinmentBooked = resp.count;
                        this.TotalIncome = resp.totalIncome;

                        this.admin_Service.getAllClient(0, 5).subscribe(
                          (resClients: any) => {
                            this.ClientData = resClients.data;
                            this.TotalPatient = resClients.totalCount;

                            this.single = [
                              { "name": "Total Doctor", "value": this.TotalApprovedDoctor },
                              //{ "name": "Total Pending Doctor", "value": this.TotalPendingDoctor },
                              { "name": "Total Assistant", "value": this.TotalAssistant },
                              //{ "name": "Total Pending Assistant", "value": this.TotalPendingAssistant },
                              { "name": "Total Patient", "value": this.TotalPatient },
                              { "name": "Total Income", "value":this.TotalIncome},
                              { "name": "Total Booked Appointment", "value":this.TotalAppoinmentBooked}
                              
                            ];
                            this.charLoaded = true;
                          },
                          (error) => {
                            console.log(error);
                          }
                        );

                      },
                      (error) => {
                        console.log(error);
                      }
                    );
                  },
                  (error) => {
                    console.log(error);
                  }
                );
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }




  //--------------------------Approve Doctor by Id 
  getApprovedDoctor(id: any) {
    debugger
    Swal.fire({
      title: 'Are you sure you want to approve this doctor?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Approve'
    }).then((result) => {
      if (result.isConfirmed) {
        this.admin_Service.postApproveDoctorById(id).subscribe(rep => {
          console.log(rep);
          if (rep == "Approved") {
            this.loadCharData();
            Swal.fire(
              'Approved!',
              'The doctor has been approved.',
              'success'
            );
            // You can add any additional logic here after approval
          }
        });
      }
    });
  }





  Logout() {
    localStorage.clear();
  }

}