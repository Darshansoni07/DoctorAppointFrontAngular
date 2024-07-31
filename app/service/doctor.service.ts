import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private base_Url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //---------------------------Checking doctor-metaRequest profile 
  doctorProfileApprove(id: any): Observable<any> {
    if (id) {
      return this.http.get(this.base_Url + "Doctor/checkDoctor/" + id, { responseType: "text" });
    }
    else {
      return id;
    }
  }

  //--------------------------get doctor metadata by id 
  doctorMetaDataById(Id: any): Observable<any> {
    debugger
    const metaId = this.getMetaId();
    if (Id) {
      return this.http.get(this.base_Url + "Doctor/getDoctorMetaDetail/" + Id);
    }
    return of(null);
  }

  //-----------------Get slot create by meta Id 
  postSlotByDoctor(Data: any): Observable<any> {
    debugger
    return this.http.post(this.base_Url + "Slot/createSlot", Data, { responseType: "text" });
  }

  //------------------Get Slot By Meta Id
  getSlotByMetaId(metaId: any, pageIndex:any,pageSize:any): Observable<any> {
    return this.http.get<any[]>(this.base_Url + "Slot/getSolt/" + metaId+`?pageIndex=${pageIndex}&pageSize=${pageSize}`);
  }

  //-----------------Get Slot By Slot Id
  getSlotBySlotId(slotId: any): Observable<any> {
    return this.http.get(this.base_Url + "Slot/getSlotById/" + slotId);
  }

  //-------------------Update slot by slot id
  updateSlotBySlotId(slotId: any, Data: any): Observable<any> {
    return this.http.put(this.base_Url + "Slot/updateSlotById/" + slotId, Data, { responseType: "text" });
  }


  //-------------------- Create Assistant 
  createAssistant(Data:any):Observable<any>{
    return this.http.post(this.base_Url+"Assistant/AssistantRegister",Data, {responseType:"text"});
  }

  //---------------------- Doctor get there own assistant      
  doctorGetOwnAssistant(pageIndex:any,pageSize:any):Observable<any>{
    debugger
    const metaId =this.getMetaId();
    if(metaId)
    return this.http.get(this.base_Url+"Doctor/doctorGetAllOwnAssistantById/"+metaId+`?pageIndex=${pageIndex}&pageSize=${pageSize}`);
    else
    return of(null);
  }


  //-----------------------------Getting user Reports of patient------------- By doctor Id and paitent Id
  getPatientReportDetails(userId:any, pageIndex:any,pageSize:any):Observable<any[]>{
    debugger
    const metaId = this.getMetaId();
    if(metaId)
    return this.http.get<any[]>(this.base_Url + "Report/getReportData"+`?patientId=${userId}&metaId=${metaId}&pageIndex=${pageIndex}&pageSize=${pageSize}`);
    else
    return of([null]);
  }

  
  //----------------------Assistant Get Doctor details        ----------------------- assistant user Only ---------------------
  assistantGetDoctorDetails(metaId:any):Observable<any>{
    return this.http.get(this.base_Url+"Assistant/assistantgetdoctor/"+metaId);
  }

  




  getMetaId(){
    const value = localStorage.getItem('MetaDataId');
    return value;
  }

}
