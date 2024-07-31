import { Component, OnInit } from '@angular/core';
import { MainpageService } from 'src/app/service/mainpage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  getAllDoctorData: any[] = [];
  appointId: any;
  pageIndex: number = 0;
  pageSize: number = 10;
  filterKey: string = '';
  totalpage: any;

  constructor(private mainService: MainpageService, private route: Router) { }

  ngOnInit(): void {
    this.getAllDoctorDetails();
  }

  //------------------------ Get All Doctor Details 
  getAllDoctorDetails() {
    debugger
    this.mainService.getAllDoctorProfileDetails(this.pageIndex, this.pageSize, this.filterKey).subscribe((res: any) => {
      this.getAllDoctorData = res.data;
      this.totalpage = res.totalData;
      console.log(res);
    });
  }

  applyFilter() {
    this.pageIndex = 0; // Reset pageIndex when applying filter
    this.getAllDoctorDetails();
  }

  //---------------------- Get Doctor By Id
  getDoctorById(Id: any) {
    this.route.navigate(['/doctordetails', Id]);
  }

  onPageChange(pageIndex: number) {
    if (pageIndex >= 0) {
      this.pageIndex = pageIndex;
      this.getAllDoctorDetails();
    }
  }

  onNextButtonClick() {
    if (!this.isNextButtonDisabled()) {
      this.onPageChange(this.pageIndex + 1);
    }
  }

  isNextButtonDisabled(): boolean {
    const totalPages = Math.ceil(this.totalpage / this.pageSize);
    return this.pageIndex >= totalPages - 1;
  }


  getPaginationIndices() {

    const totalPages = Math.ceil(this.getAllDoctorData.length / this.pageSize);
    return Array.from(Array(totalPages).keys());
  }

}