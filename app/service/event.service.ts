import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private base_Url = environment.apiUrl;
  private events: any[] = [];
  private eventIdCounter = 1;

  constructor(private http: HttpClient) { }


  getAllDateAppointment(metaId:any,date:any,pageIndex:any ):Observable<any>{

    if(metaId){
    const url = `${this.base_Url}Appointment/getAllDateSelectedAppointment/${metaId}?date=${date}&pageIndex=${pageIndex}`;
    return this.http.get<any[]>(url);
    }
    return of(null);  
      
  }  


  getEvents(): any[] {
    return this.events;
  }

  getEventsForDate(date: Date): any[] {
    return this.events.filter(event => this.isSameDate(event.date, date));
  }

  addEvent(title: string, date: Date, time?: string, description?: string): void {
    this.events.push({ id: this.eventIdCounter++, title, date, time, description });
  }

  updateEvent(event: any): void {
    const index = this.events.findIndex(e => e.id === event.id);
    if (index !== -1) {
      this.events[index] = event;
    }
  }

  deleteEvent(id: number): void {
    this.events = this.events.filter(event => event.id !== id);
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      return false;
    }
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}
