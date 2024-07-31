import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-learn',
  templateUrl: './learn.component.html',
  styleUrls: ['./learn.component.css']
})
export class LearnComponent implements OnInit, AfterViewInit {

  pageIndex: number = 0;
  pageSize: number = 5;
  currentPage = 0;

  dataMat!: MatTableDataSource<any>;
  totalItem: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  totalData: any;

  pageS = [3, 5, 7];
  constructor(private adminService: AdminAccountService) { }


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
    
    return this.adminService.getAllAppointmentDetail(pageNumber, pageSize);


  }

  ngOnInit(): void {
    //this.loadFunction();
  }


}


