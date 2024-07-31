import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRegisterComponent } from './pages/app-register/app-register.component';
import { AppLoginComponent } from './pages/app-login/app-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminClientListComponent } from './admin/admin-client-list/admin-client-list.component';
import { UserProfileComponent } from './profile-detail/user-profile/user-profile.component';
import { MainComponent } from './shared/main/main.component';
import { DoctorDashboardComponent } from './doctor/doctor-dashboard/doctor-dashboard.component';
import { DoctorDashboardDataComponent } from './doctor/doctor-dashboard-data/doctor-dashboard-data.component';
import { DoctorSlotListComponent } from './doctor/doctor-slot-list/doctor-slot-list.component';
import { DoctorCreateSlotComponent } from './doctor/doctor-create-slot/doctor-create-slot.component';
import { DoctorClientsAppointmentComponent } from './doctor/doctor-clients-appointment/doctor-clients-appointment.component';
import { DoctorActivitiesAppointmentComponent } from './doctor/doctor-activities-appointment/doctor-activities-appointment.component';
import { DoctorDetailsComponent } from './mainpage/doctor-details/doctor-details.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UserProfileSidebarComponent } from './profile-detail/user-profile-sidebar/user-profile-sidebar.component';
import { UserBookingsComponent } from './profile-detail/user-bookings/user-bookings.component';
import { AdminDashboardDataComponent } from './admin/admin-dashboard-data/admin-dashboard-data.component';
import { AdminDoctorPendingComponent } from './admin/admin-doctor-pending/admin-doctor-pending.component';
import { AdminDoctorListComponent } from './admin/admin-doctor-list/admin-doctor-list.component';
import { ErrorComponent } from './shared/error/error.component';
import { DoctorAssistantRegisterComponent } from './doctor/doctor-assistant-register/doctor-assistant-register.component';
import { AdminAssistantPendingComponent } from './admin/admin-assistant-pending/admin-assistant-pending.component';
import { AdminAssistantDetailComponent } from './admin/admin-assistant-detail/admin-assistant-detail.component';
import { DoctorAssistantListComponent } from './doctor/doctor-assistant-list/doctor-assistant-list.component';
import { UserDashboardComponent } from './profile-detail/user-dashboard/user-dashboard.component';
import { UserDashboardDataComponent } from './profile-detail/user-dashboard-data/user-dashboard-data.component';
import { DoctorPatientInfoComponent } from './doctor/doctor-patient-info/doctor-patient-info.component';

//Router Path
const routes: Routes = [
  {
    path:"", component:MainComponent
  },
  {
    path:"Register", component:AppRegisterComponent
  },
  {
    path:"Login", component:AppLoginComponent
  }, 

  {
    path:'docAppoint', component:MainComponent,    
  },
  
  {
    path:'doctordetails/:id',component:DoctorDetailsComponent
  },

  {
    path:"admin", component:AdminDashboardComponent,canActivate:[AuthGuard],data:{roles:['Admin']}, 
    children:
    [
      {
        path:'dashboard',
        component:AdminDashboardDataComponent,
      },
      {
        path:'doctorpendinglist',
        component:AdminDoctorPendingComponent,
      },
      {
        path:'doctorlist',
        component:AdminDoctorListComponent,
      },
      {
        path:'paitentlist',
        component:AdminClientListComponent,
        canActivate:[AuthGuard],
        data:{roles:['Admin']}
      },
      {
        path:'assistantpending',
        component:AdminAssistantPendingComponent
      },
      {
        path:'assistantdetail',
        component:AdminAssistantDetailComponent
      }
    ]
  },
  // {
  //   path:"clientlist", component:AdminClientListComponent, canActivate:[AuthGuard],data:{roles:['Admin']}, 
  // },
  {
    path:"docAppoint", component:UserProfileSidebarComponent,canActivate:[AuthGuard],data:{roles:['Doctor','Client','Assistant']},
    children:
    [
      {
        path:'profile',
        component:UserProfileComponent
      },
      {
        path:'Bookings',
        component:UserBookingsComponent
      }
    ]
  }, 

  {
    path:"doctor", component:DoctorDashboardComponent,canActivate:[AuthGuard],data:{roles:['Doctor','Assistant']},
    children:
    [
      {
        path:"dashboard",component:DoctorDashboardDataComponent
      },
      {
        path:"slotlist",component:DoctorSlotListComponent
      },
      {
        path:"createslot",component:DoctorCreateSlotComponent
      },
      {
        path:"appointment", component:DoctorClientsAppointmentComponent
      },
      {
        path:"activity", component:DoctorActivitiesAppointmentComponent
      },
      {
        path:"patientinfo/:id", component:DoctorPatientInfoComponent
      },
      {
        path:"assistantregister", component:DoctorAssistantRegisterComponent,
        canActivate:[AuthGuard],
        data:{roles:['Doctor']}
      },
      {
        path:"assistantlist", component:DoctorAssistantListComponent,
        canActivate:[AuthGuard],
        data:{roles:['Doctor']}
      }
    ]  
  },
  {
    path:"dashboard", component:UserDashboardComponent,canActivate:[AuthGuard],data:{roles:['Client']},
    children:
    [
      {
        path:'data',
        component:UserDashboardDataComponent
      },
      {
        path:'bookings',
        component:UserBookingsComponent
      }
    ]
  },
   
  {
    path: '**',
    component:ErrorComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { 
  // constructor(private router: Router){
  //   router.events.subscribe(event=>{
  //     if(event instanceof NavigationStart){
  //       console.log('Navigation started');
  //     }
  //   })
  // }
}