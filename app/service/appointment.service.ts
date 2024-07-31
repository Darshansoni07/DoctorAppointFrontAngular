import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  metaId : any;
  private baseUrl = environment.apiUrl;


  constructor(private http:HttpClient) { }

  //------------------------Get All Appointment
  getAllAppointment(pageIndex:any,pageSize:any):Observable<any>{
    this.getMetaId();
    debugger
    if(this.metaId){
    let url = `${this.baseUrl}Appointment/getAllApprovedAppointment/${this.metaId}`;
    if(pageIndex && pageSize){
      url +=`?pageIndex=${pageIndex}&pageSize=${pageSize}`;      
    }
    return this.http.get<any[]>(url);
  }
  else {
    return of(null);
  }
    //return this.http.get<any[]>(this.baseUrl+"Appointment/getAllApprovedAppointment/"+this.metaId);
  }


  //------------------------Get All Appointment Which is Pending For Approval 
  getAllPendingAppointment(pageIndex:any,pageSize:any):Observable<any>{
    this.getMetaId();
    return this.http.get<any[]>(this.baseUrl+"Appointment/appointmentGetAll/"+this.metaId+`?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }

  //----------------------- Approve pending Request send By Doctoe
  approvePendingRequestAppoint(Id:any):Observable<any>{
    return this.http.post(this.baseUrl+"Appointment/appointmentApproveByDoc/"+Id,{},{responseType:"text"});
  } 


  //----------------------- Approved Appointment get all where peri and next date data is coming 
  getAllApprovedAppointment(pageIndex:any,pageSize:any):Observable<any>{
    this.getMetaId();
    debugger
    if(this.metaId)
    return this.http.get<any[]>(this.baseUrl + `Appointment/getAllApproveAppointments/${this.metaId}?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    else
    return of(null);
  }
  // const url = `${this.base_Url}Slot/getSlotDataOnDate/${metaId}?date=${date}`;
   // return this.http.get<any[]>(url);

  //---------------------- Get Appointment By Id 
  getAppointmentById(Id:any):Observable<any>{
    return this.http.get(this.baseUrl+"Appointment/appointmentDetailById/"+Id);
  }

  // -------------------------------Get Report Appointment data
  getReportByAppointId(Id:any):Observable<any>{
    return this.http.get(this.baseUrl+"Appointment/reportAppointById/"+Id);
  }

  
  //---------------------- Update Appointment status
  updateAppointmentStatus(Id:any, Data:any):Observable<any>
  {
    debugger;
    return this.http.put(this.baseUrl+"Appointment/appointUpdate/"+Id, Data, {responseType:"text"});
  }

  //-----------------------Get Today Appointment which is approved
  getAllTodayAppointment():Observable<any>{
    this.getMetaId();
    return this.http.get<any[]>(this.baseUrl+"Appointment/getAllTodayAppointment/"+this.metaId);
  }

  getMetaId(){
    this.metaId = localStorage.getItem("MetaDataId");
  }

  //--------------------------------- Dowload report of appointment data
  getDownload(FileName:any):Observable<Blob>{
    debugger
    const options = { responseType: 'blob' as 'json' };
    return this.http.get<Blob>(this.baseUrl+"Report/getReportFile/"+FileName, options);
  }

}
