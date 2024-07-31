import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  selectedDate!: Date;
  events: any[] = [];
  todayDate: Date = new Date();

  constructor(private eventService: EventService) {
   
  }

  ngOnInit(): void {
    this.selectedDate = this.todayDate;
    this.events = this.eventService.getEventsForDate(this.selectedDate);
    this.loadEventsForSelectedDate();
  }

  onDateChange(date: Date) {
    debugger
    console.log(date);
    this.selectedDate = date;
    this.events = this.eventService.getEventsForDate(date);
  }
  loadEventsForSelectedDate() {
    debugger
    this.events = this.eventService.getEventsForDate(this.selectedDate);
  }

  createEvent(title: string, date: Date, time?: string, description?: string) {
    debugger
    this.eventService.addEvent(title, date, time, description);
    this.events = this.eventService.getEventsForDate(this.selectedDate);
    
  }

  updateEvent(event: any) {
    this.eventService.updateEvent(event);    
  }

  deleteEvent(id: number) {
    this.eventService.deleteEvent(id);
    this.events = this.eventService.getEventsForDate(this.selectedDate);
  }

 
}
