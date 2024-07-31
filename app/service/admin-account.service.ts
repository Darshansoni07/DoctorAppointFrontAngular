import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAccountService {

  private baseUrl = environment.apiUrl;
  constructor(private http:HttpClient) { }


  //---------get All Client detials 
  getAllClient(pageIndex:any,pageSize:any):Observable<any[]>{    
    return this.http.get<any[]>(this.baseUrl+`Admin/getAllClient?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }

  //----------get All Doctor Not Approved details
  getDoctorForApprove(pageIndex?:any,pageSize?:any):Observable<any[]>{
    debugger
    return this.http.get<any[]>(this.baseUrl+`Admin/doctorApproveRequest?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }

  //------------Get Client by Id Details
  getClientById(Id : any):Observable<any>{
    return this.http.get<any>(this.baseUrl+"Admin/getClientDetailsById/"+Id);
  }

  //------------Approved Doctor By Id 
  postApproveDoctorById(Id : any):Observable<any>{  
    return this.http.post(this.baseUrl+"Admin/approveDoctorById/"+ Id , null, {responseType:"text"});
  }

  //------------------- Gett all approved doctor with pagination
  getAllApproveDoctor(pageIndex:any,pageSize:any):Observable<any[]>{
    
    return this.http.get<any[]>(this.baseUrl + `Admin/getAllDoctorDetail?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }
  //------------------- Gett all approved doctor 
  getAllApproveDoctorCount():Observable<any[]>{
    
    return this.http.get<any[]>(this.baseUrl + `Admin/getAllDoctorDetails`);
  }

  //------------------Get All Assistant for approval 
  getAllPendingAssistant():Observable<any[]>{
    debugger
    return this.http.get<any[]>(this.baseUrl+"Admin/getAllAssistantWithRequest");
  }


  //------------Approved Assistant By Id 
  assistantApproveById(Id : any):Observable<any>{  
    debugger
    return this.http.put(this.baseUrl+"Admin/approveAssistantById/"+ Id , null, {responseType:"text"});
  }


  //-----------Get All Assistant Approved 
  getAllAssistant(pageIndex:any,pageSize:any):Observable<any[]>{
    
    return this.http.get<any[]>(this.baseUrl+`Admin/getAllApproveAssistant?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }


  getAllAppointmentDetail(pageIndex:any,pageSize:any):Observable<any[]>{
    return this.http.get<any[]>(this.baseUrl+`Admin/adminGetAppointmentDetails?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }

  
}
