import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import flatpickr from 'flatpickr';
import { DoctorService } from 'src/app/service/doctor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-create-slot',
  templateUrl: './doctor-create-slot.component.html',
  styleUrls: ['./doctor-create-slot.component.css']
})
export class DoctorCreateSlotComponent implements OnInit {

  slotForm!: FormGroup;
  metaId:any;
  metadata:any;
  constructor(private formBuilder: FormBuilder,
    private doctorService:DoctorService) { }

  ngOnInit(): void {
    this.data();
    flatpickr('.flatpickr', {
      enableTime: true, // Enable time picker
      dateFormat: 'Y-m-d H:i', // Date and time format      
      minDate: 'today', // Set the minimum date and time to today
    });
  }
  
  data(){
    this.metaId = localStorage.getItem("MetaDataId");
    this.slotForm = this.formBuilder.group({
      metadataDoc_meta_Id: this.metaId,
      interval: new FormControl(null, Validators.required),
      startTimeslot:new FormControl(null, Validators.required),
      endTimeslot: new FormControl(null, Validators.required)
    });
  }

  createSlot() {
    if (this.slotForm.valid) {      
      const selectedDate = this.slotForm.value;
      selectedDate.startTimeslot = this.formatDateTime(selectedDate.startTimeslot);
      selectedDate.endTimeslot = this.formatDateTime(selectedDate.endTimeslot);
      console.log(selectedDate);
      debugger
      this.metadata = this.doctorService.postSlotByDoctor(selectedDate).subscribe(
        resp=>{
          if (resp === 'Create Time Slot') {
            Swal.fire('Success', 'Time slot is created', 'success');
          } else if (resp === 'Not Create At This Time Sechdule') {
            Swal.fire('Error', 'This time is Already Exsist Please try to select next time slot', 'error');
          }
          debugger
          console.log(resp);
        }
      );
      this.slotForm.reset();
    } 
  }

  formatDateTime(dateTimeString: string):string{
    const [date, time] = dateTimeString.split(' ');
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }

  get interval(){
    return this.slotForm.get('interval');
  }

  get startTimeslot(){
    return this.slotForm.get('startTimeslot');
  }

  get endTimeslot(){
    return this.slotForm.get('endTimeslot');
  }
    
}