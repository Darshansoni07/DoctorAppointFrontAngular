import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { startWith, switchMap, catchError, of, map } from 'rxjs';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { DoctorService } from 'src/app/service/doctor.service';

@Component({
  selector: 'app-doctor-assistant-list',
  templateUrl: './doctor-assistant-list.component.html',
  styleUrls: ['./doctor-assistant-list.component.css']
})
export class DoctorAssistantListComponent implements OnInit {

  pageIndex: number = 0;
  pageSize: number = 5;
  currentPage = 0;

  dataMat!: MatTableDataSource<any>;
  totalItem: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalData: any;

  pageS = [3, 5, 7];
  constructor(private doctorService: DoctorService) { }


  ngAfterViewInit() {
    debugger
    //this.dataMat.paginator = this.paginator;

    console.log(this.paginator.pageIndex, this.paginator.pageSize);
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => {
          return this.getTableData$(
            this.paginator.pageIndex,
            this.paginator.pageSize
          ).pipe(catchError(() => {
            return of(null);
          }));
        }),
        map((empData: any) => {
          if (empData == null) return [];
          debugger
          console.log(empData);
          this.totalItem = empData.count;
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


  getTableData$(pageNumber: number, pageSize: number) {
    debugger    
    return this.doctorService.doctorGetOwnAssistant(pageNumber, pageSize);


  }

  ngOnInit(): void {
    //this.loadFunction();
  }

}
