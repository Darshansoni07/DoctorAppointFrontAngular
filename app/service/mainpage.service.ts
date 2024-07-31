import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MainpageService {

  private base_Url = environment.apiUrl;
  private localStorageKey: string | undefined;

  constructor(private http: HttpClient) { }


  //--------------------------get all Doctor
  getAllDoctorProfileDetails(pageIndex: number = 0, pageSize: number = 10, filterkey?:string):Observable<any[]>{
    
    let url = `${this.base_Url}Admin/getAllDoctorDetail?pageIndex=${pageIndex}&pageSize=${pageSize}`;
    if(filterkey){
      url +=`&filter=${filterkey}`;      
    }
    return this.http.get<any[]>(url);
 
  }

  //---------------------------get Doctor By Id 
  getDoctorById(Id:any):Observable<any>{
    return this.http.get(this.base_Url+"Admin/getDocById/"+Id);
  }

  //--------------------------- get Slot By metaId
  getAllSlotByMetaId(metaId:any):Observable<any[]>{
    debugger
    return this.http.get<any[]>(this.base_Url+"Slot/getSolt/"+metaId);
  }


  //--------------------------- get selected date slot 
  getSelectedDateSlot(metaId:any,date:any){
    const url = `${this.base_Url}Slot/getSlotDataOnDate/${metaId}?date=${date}`;
    return this.http.get<any[]>(url);
  }

}