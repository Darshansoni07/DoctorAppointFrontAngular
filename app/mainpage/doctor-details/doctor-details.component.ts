import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import flatpickr from 'flatpickr';
import { MainpageService } from 'src/app/service/mainpage.service';
import { UserAccountService } from 'src/app/service/user-account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-details',
  templateUrl: './doctor-details.component.html',
  styleUrls: ['./doctor-details.component.css']
})
export class DoctorDetailsComponent implements OnInit {

  testId!: string;
  doctorData: any;
  metaId: any;
  slotData: any[] = [];
  today: any;
  selectedDate: any;

  constructor(private route: ActivatedRoute,
    private mainPage: MainpageService,
    private userService: UserAccountService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.loadFunction();
  }

  //---------------------- Loading function 
  loadFunction() {
    this.getDoctorById();
    this.today = new Date().toISOString().slice(0, 10);
    const self = this;
    flatpickr('.flatpickr', {
      dateFormat: 'Y-m-d',
      minDate: 'today',
      defaultDate: this.today,
      onChange: function (selectedDates, dateStr, instance) {
        // Log the selected date to the console
        self.selectedDate = dateStr;
        self.getDateOnSlots(dateStr);
      }
    });
    this.getDateOnSlots(this.selectedDate);
  }

  //----------------- Getting doctor data by Id from url  
  getDoctorById() {
    this.route.params.subscribe(params => {
      this.testId = params['id'];
    });
    this.doctorData = this.mainPage.getDoctorById(this.testId).subscribe((res) => {
      this.doctorData = res;
      this.metaId = res.doc_meta_Id;
      this.getTodaySlot(this.metaId);
    });
  }

  //--------------------------On click event For Appointment 
  handleSlotClick(slot: any) {
    const data = this.userService.loadCurrentUser();
    if (data) {
      Swal.fire({
        icon: 'warning',
        title: 'Do you want book this Appoitment!',
        html: `<p>Appointment details: You can book only one slot a day!</p>
        <p>Date: ${slot.startTimeslot.substring(10, 0)}</p>
        <p>Time: ${this.formatTime(slot.startTimeslot)}</p>`,
        text: 'Do you want to book this appointment?',
        showCancelButton: true,
        confirmButtonText: 'Yes, book it!',
        cancelButtonText: 'No, cancel!',
      }).then((result) => {
        if (result.isConfirmed) {
          const bookData = { slotId: slot.slotId, userDetailsUser_Id: data.nameid };
          debugger
          if (data.role === 'Client') {
            debugger
            this.userService.bookAppointmentByUserId(bookData).subscribe((resp) => {
              if (resp == "Appointment Booked") {
                Swal.fire({
                  icon: 'success',
                  title: 'Appointment Booked Successfully!',
                  text: 'Your appointment has been successfully booked. Pending Approval from Doctor side',
                });
              }
              else if (resp == "Slot Booked") {
                Swal.fire({
                  icon: 'warning',
                  title: 'This is Appointment Already Booked!! ',
                  text: 'please refresh the page!',
                });
              }
              else if (resp == "You Have Already Booked for this Day") {
                Swal.fire({
                  icon: 'warning',
                  title: 'You Have Already Booked for this Day!! ',
                  text: 'please select another day!',
                });
              }
            });
          }
        }
      });
    }

    else {
      Swal.fire({
        icon: 'warning',
        title: 'Please login for book Appoinment!',
        showCancelButton: true,
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigateByUrl('/Login');
          // Handle login action here, e.g., navigate to login page
          console.log('User clicked Login button');
        } else {
          console.log('User clicked Cancel button');
        }
      });
    }
    console.log('Slot clicked:', slot, data);
  }


  //----------------- Get Current date Slot 
  getTodaySlot(metaId: any) {
    this.mainPage.getSelectedDateSlot(metaId, this.today).subscribe((resp) => {
      this.slotData = resp;
    });
  }

  //----------------- Get Selected Date Data
  getDateOnSlots(date: any) {

    if (date != null) {
      this.today = this.formatDateTime(date);
      this.mainPage.getSelectedDateSlot(this.metaId, this.today).subscribe((resp) => {
        console.log("Slot List", resp);
        this.slotData = resp;
      });
    }
  }


  //------------------ FormatTime
  formatTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }



  //---------------------------- Date Formate
  formatDateTime(dateString: string): string {
    const [year, month, day] = dateString.split('-');

    // Pad single-digit month and day with leading zeros
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');

    return `${year}-${paddedMonth}-${paddedDay}T00:00:00`;
  }



}
