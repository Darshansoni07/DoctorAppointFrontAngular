import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import flatpickr from 'flatpickr';
import { startWith, switchMap, catchError, of, map } from 'rxjs';
import { DoctorService } from 'src/app/service/doctor.service';

@Component({
  selector: 'app-doctor-slot-list',
  templateUrl: './doctor-slot-list.component.html',
  styleUrls: ['./doctor-slot-list.component.css']
})
export class DoctorSlotListComponent implements OnInit {

  // slotData:any[]=[];  
  // slicedData: any[] = [];
  metaId:any;
  // currentPage = 1;
  // itemsPerPage = 5;
  // totalItems = 0;  
  // showModal: boolean =false;
  // updateForm!:FormGroup;
  slotId:any;

  pageIndex: number = 0;
  pageSize: number = 5;
  currentPage = 0;
  showModal:boolean=false;
  updateForm!:FormGroup;
  appointmentId:any;

  dataMat!: MatTableDataSource<any>;
  totalItem: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalData: any;

  constructor(private doctorService:DoctorService,
    private fb: FormBuilder) { }

    ngAfterViewInit() {
      debugger
      //this.dataMat.paginator = this.paginator;
  
      console.log(this.paginator.pageIndex, this.paginator.pageSize);
      this.paginator.page
        .pipe(
          startWith({}),
          switchMap(() => {
            return this.getListByMetaId(
              this.paginator.pageIndex,
              this.paginator.pageSize
            ).pipe(catchError(() => {
              return of(null);
            }));
          }),
          map((empData: any) => {
            if (empData == null) return [];
            debugger;
            console.log(empData);
            this.totalItem = empData.totalData;
            this.totalData = empData.data;
            return empData.data;
          })
        )
        .subscribe((empData:any) => {
          debugger
          this.dataMat = new MatTableDataSource(empData);
          this.dataMat.sort = this.sort;
        });
    }
    

  ngOnInit(): void {   
   
  }

  //------------------------getting list by metadata id 
  getListByMetaId(pageNumber: number, pageSize: number){    
    this.metaId = localStorage.getItem("MetaDataId");
   this.doctorService.getSlotByMetaId(this.metaId,pageNumber, pageSize).subscribe(
    (resp)=>{
      // this.slotData=resp.data;
      // this.totalItems=this.slotData.length;
      // this.updateSlicedData();      
    }); 
    return this.doctorService.getSlotByMetaId(this.metaId,pageNumber,pageSize);  
  }

  //----------------------get data on select by slot id
  onSelectSlotId(slotId:any){
    console.log(slotId);
    this.showModal = true;
    this.doctorService.getSlotBySlotId(slotId).subscribe(
      resp=>{
        resp.startTimeslot= this.reverseFormatDateTime(resp.startTimeslot);
        resp.endTimeslot= this.reverseFormatDateTime(resp.endTimeslot);
        console.log(resp);
        this.createUpdate(resp);
      }
    );
  }

  //------------------create update form
  createUpdate(data:any)
  {
    flatpickr('.flatpickr', {
      enableTime: true, 
      dateFormat: 'Y-m-d H:i',      
      minDate: 'today', 
    });
    debugger
    this.slotId = data.slotId;
    this.updateForm = this.fb.group({
      startTimeslot:data.startTimeslot,
      endTimeslot:data.endTimeslot,
      status:data.status
      
    });
  }

  //----------------update post
  updateOnSelect(){   
    if(this.updateForm.valid){
      const selecteddate = this.updateForm.value;
      selecteddate.startTimeslot = this.formatDateTime(selecteddate.startTimeslot);
      selecteddate.endTimeslot = this.formatDateTime(selecteddate.endTimeslot);      
      console.log(this.updateForm.value);
      console.log(this.slotId);
      this.doctorService.updateSlotBySlotId(this.slotId,this.updateForm.value).subscribe(resp=>{
        this.ngAfterViewInit();
        console.log(resp);
      });
    }
  }

  closeModal(){
    this.showModal=false;
  }

  //-------------------Time Formate 
  reverseFormatDateTime(dateTimeString:string) {
    const [datePart, timePart] = dateTimeString.split('T');
    const [year, month, day] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
  
  //---------------------Time Formater
  formatDateTime(dateTimeString: string):string{
    const [date, time] = dateTimeString.split(' ');
    const [year, month, day] = date.split('-');
    const [hours, minutes] = time.split(':');
    return `${year}-${month}-${day}T${hours}:${minutes}:00`;
  }



}