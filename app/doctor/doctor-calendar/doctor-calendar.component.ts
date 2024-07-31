import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/service/event.service';

@Component({
  selector: 'app-doctor-calendar',
  templateUrl: './doctor-calendar.component.html',
  styleUrls: ['./doctor-calendar.component.css']
})
export class DoctorCalendarComponent implements OnInit {

  selectedDate!: Date;
  events: any[] = [];
  todayDate: Date = new Date();
  showModal: boolean = false;
  metaId: any;
  appointmentData: any[] = [];

  constructor(private eventService: EventService) {

  }

  ngOnInit(): void {
    this.metaId = localStorage.getItem("MetaDataId");
    this.todayDate = new Date();
    this.selectedDate = this.todayDate;
    this.events = this.eventService.getEventsForDate(this.selectedDate);
    this.loadEventsForSelectedDate();
  }

  //<=======================================Event Genreating On Click===============>
  onDateChange(date: Date) {
    debugger
    console.log(date);
    const formattedDate = this.formatToCSharpDate(date);
    // -------- Appointment Data
    this.eventService.getAllDateAppointment(this.metaId, formattedDate, 0).subscribe(
      (resp) => {
        this.appointmentData = resp;
        console.log(resp);
        this.showModal = true;
      });
  }


  loadEventsForSelectedDate() {
    debugger
    this.events = this.eventService.getEventsForDate(this.selectedDate);
  }

  closeModal() {
    this.showModal = false;
  }

  formatToCSharpDate(date: Date): string {
    const year = date.getFullYear();
    const month = this.padZero(date.getMonth() + 1);
    const day = this.padZero(date.getDate());
    const hours = this.padZero(date.getHours());
    const minutes = this.padZero(date.getMinutes());
    const seconds = this.padZero(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
}