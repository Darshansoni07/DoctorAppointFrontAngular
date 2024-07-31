import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {

  private base_Url = environment.apiUrl;
  user_Token: any;
  jwtHelperService = new JwtHelperService();

  constructor(private http: HttpClient) { }

  //----------------------------register User
  registerUser(user: any): Observable<any> {
    debugger;
    return this.http.post(this.base_Url + "Account/Register", user, { responseType: 'text' });
  }

  //--------------------------------- Login user
  loginUser(user: any): Observable<any> {
    debugger;
    this.user_Token = this.http.post(this.base_Url + "Account/login", user, { responseType: 'text' });
    return this.user_Token;
  }

  //--------------------- Update User By Id 
  updateUserById(id: any, data: any): Observable<any> {
    debugger
    return this.http.put(this.base_Url + "Admin/updateDetailsClient/" + id, data, { responseType: 'text' });
  }

  //---------------------- Update User
  updateUser(data: any): Observable<any> {
    debugger
    return this.http.put(this.base_Url + "Account/userUpdate", data, { responseType: 'text' });
  }

  //------------------- Post data of doctor meta form
  postDoctorMetaData(metaData: any): Observable<any> {
    debugger
    return this.http.post(this.base_Url + "Doctor/doctorRegister", metaData, { 'responseType': 'text' });
  }

  //------------------------ Book Appointment By slotId and userId
  bookAppointmentByUserId(data: any): Observable<any> {
    return this.http.post(this.base_Url + "Appointment/appointmentCreate", data, { responseType: "text" });
  }

  bookAppointmentUser(data: any, pageIndex: any, pageSize: any): Observable<any[]> {
    let url = `${this.base_Url}Appointment/getUserBooking/${data}`;
    if (pageIndex && pageSize) {
      url += `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    }
    return this.http.get<any[]>(url);
  }


  paitentGetUpcomingAppointment(data: any, pageIndex: any, pageSize: any): Observable<any[]> {
    let url = `${this.base_Url}Appointment/getPaitentUpcomingAppointment/${data}`;
    if (pageIndex && pageSize) {
      url += `?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    }
    return this.http.get<any[]>(url);
  }

  //---------------------- getting meta Id from Assistant           ------------Assistant user Only--------------
  assistantDoctorMap(email: any): Observable<any> {
    return this.http.get<any>(this.base_Url + "Assistant/assistantmapdetails/" + email);
  }

  //----------------------- Set Token localStorage
  setToken(token: string) {
    localStorage.setItem("access_token", token);
    this.loadCurrentUser();
  }

  //--------------------- Status Check Login or Not 
  isLoggedIn(): boolean {
    return localStorage.getItem("access_token") ? true : false;
  }


  getRole() {
    var type = localStorage.getItem("user_Role");
    return type;
  }


  //--------------------------- Loading Current Users which is logged in 
  loadCurrentUser() {
    debugger
    const token = localStorage.getItem("access_token");
    if (token) {
      const token_encrp = this.jwtHelperService.decodeToken(token);
      const data = token_encrp ? {
        email: token_encrp.email,
        role: token_encrp.role,
        unique_name: token_encrp.unique_name,
        nameid: token_encrp.nameid
      } : null;
      localStorage.setItem("user_Role", token_encrp.role);
      return token_encrp ? {
        email: token_encrp.email,
        role: token_encrp.role,
        unique_name: token_encrp.unique_name,
        nameid: token_encrp.nameid
      } : null;
      // Use data as needed
    } else {
      // Handle case when token is null (e.g., user is not authenticated)
      console.log('Access token not found in local storage');
      return null;
    }
  }
}