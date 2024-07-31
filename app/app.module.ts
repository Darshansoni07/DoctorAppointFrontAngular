import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppRegisterComponent } from './pages/app-register/app-register.component';
import { AppLoginComponent } from './pages/app-login/app-login.component';
import { UserAccountService } from './service/user-account.service';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AuthInterceptor } from './service/auth.interceptor';
import { AdminSideBarComponent } from './admin/admin-side-bar/admin-side-bar.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MainComponent } from './shared/main/main.component';
import { AdminClientListComponent } from './admin/admin-client-list/admin-client-list.component';
import { AdminClientDetailComponent } from './admin/admin-client-detail/admin-client-detail.component';
import { UserProfileComponent } from './profile-detail/user-profile/user-profile.component';
import { DoctorDashboardComponent } from './doctor/doctor-dashboard/doctor-dashboard.component';
import { DoctorSlotListComponent } from './doctor/doctor-slot-list/doctor-slot-list.component';
import { DoctorDashboardDataComponent } from './doctor/doctor-dashboard-data/doctor-dashboard-data.component';
import { DoctorCreateSlotComponent } from './doctor/doctor-create-slot/doctor-create-slot.component';
import { DoctorClientsAppointmentComponent } from './doctor/doctor-clients-appointment/doctor-clients-appointment.component';
import { DoctorActivitiesAppointmentComponent } from './doctor/doctor-activities-appointment/doctor-activities-appointment.component';
import { DoctorDetailsComponent } from './mainpage/doctor-details/doctor-details.component';
import { AdminDoctorListComponent } from './admin/admin-doctor-list/admin-doctor-list.component';
import { AdminDoctorDetailsComponent } from './admin/admin-doctor-details/admin-doctor-details.component';
import { MatButtonModule } from '@angular/material/button';
import { DoctorCalendarComponent } from './doctor/doctor-calendar/doctor-calendar.component';
import { UserProfileSidebarComponent } from './profile-detail/user-profile-sidebar/user-profile-sidebar.component';
import { UserBookingsComponent } from './profile-detail/user-bookings/user-bookings.component';
import { AdminDashboardDataComponent } from './admin/admin-dashboard-data/admin-dashboard-data.component';
import { AdminDoctorPendingComponent } from './admin/admin-doctor-pending/admin-doctor-pending.component';
import { ErrorComponent } from './shared/error/error.component';
import { DoctorAssistantRegisterComponent } from './doctor/doctor-assistant-register/doctor-assistant-register.component';
import { AdminAssistantPendingComponent } from './admin/admin-assistant-pending/admin-assistant-pending.component';
import { AdminAssistantDetailComponent } from './admin/admin-assistant-detail/admin-assistant-detail.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UserDoctorFormComponent } from './profile-detail/user-doctor-form/user-doctor-form.component';
import { LearnComponent } from './pages/learn/learn.component';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { DoctorAssistantListComponent } from './doctor/doctor-assistant-list/doctor-assistant-list.component';
import { DoctorDashboardDataUpcomingappointComponent } from './doctor/doctor-dashboard-data-upcomingappoint/doctor-dashboard-data-upcomingappoint.component';
import { UserDashboardComponent } from './profile-detail/user-dashboard/user-dashboard.component';
import { UserDashboardDataComponent } from './profile-detail/user-dashboard-data/user-dashboard-data.component';
import { DoctorClientAppointmentPendingComponent } from './doctor/doctor-client-appointment-pending/doctor-client-appointment-pending.component';
import { DoctorPatientInfoComponent } from './doctor/doctor-patient-info/doctor-patient-info.component';


@NgModule({
  declarations: [
    AppComponent,
    AppRegisterComponent,
    AppLoginComponent,
    AdminDashboardComponent,
    AdminSideBarComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    AdminClientListComponent,
    AdminClientDetailComponent,
    UserProfileComponent,
    DoctorDashboardComponent,
    DoctorSlotListComponent,
    DoctorDashboardDataComponent,
    DoctorCreateSlotComponent,
    DoctorClientsAppointmentComponent,
    DoctorActivitiesAppointmentComponent,
    DoctorDetailsComponent,
    AdminDoctorListComponent,
    AdminDoctorDetailsComponent,
    DoctorCalendarComponent,
    UserProfileSidebarComponent,
    UserBookingsComponent,
    AdminDashboardDataComponent,
    AdminDoctorPendingComponent,
    ErrorComponent,
    DoctorAssistantRegisterComponent,
    AdminAssistantPendingComponent,
    AdminAssistantDetailComponent,
    UserDoctorFormComponent,
    LearnComponent,
    DoctorAssistantListComponent,
    DoctorDashboardDataUpcomingappointComponent,
    UserDashboardComponent,
    UserDashboardDataComponent,
    DoctorClientAppointmentPendingComponent,
    DoctorPatientInfoComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    NgxChartsModule,
    MatSortModule
    
    


  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass:AuthInterceptor,multi:true},
    UserAccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
