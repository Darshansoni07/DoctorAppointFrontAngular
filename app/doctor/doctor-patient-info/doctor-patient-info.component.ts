import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { AppointmentService } from 'src/app/service/appointment.service';
import { DoctorService } from 'src/app/service/doctor.service';
import Swal from 'sweetalert2';

interface ChartData {
  name: string;
  series: { name: string; value: number }[]; 
}

@Component({
  selector: 'app-doctor-patient-info',
  templateUrl: './doctor-patient-info.component.html',
  styleUrls: ['./doctor-patient-info.component.css']
})
export class DoctorPatientInfoComponent implements OnInit {

  chartData : ChartData[]=[];
  testId: number = 0;
  patientData: any;
  ClientData: any[] = [];
  pageIndex: number = 0;
  pageSize: number = 5;
  totalpage: number = 0;
  

  constructor(private route: ActivatedRoute,
    private appointService: AppointmentService,
    private doctorService: DoctorService,
    private adminService: AdminAccountService) { }

  ngOnInit(): void {
    this.loadFunction();
  }


  loadFunction() {
    this.getPatientById();
  }

  routeUserId() {
    this.route.params.subscribe(params => {
      this.testId = params['id'];
    });
  }

  getPatientById() {
    this.routeUserId();
    this.adminService.getClientById(this.testId).subscribe(
      (resp) => {
        this.patientData = resp;
      }
    );
    this.getAllPatient();
  }

  // Getting Patient Data reports 
  getAllPatient() {
    this.routeUserId();
    this.doctorService.getPatientReportDetails(this.testId, this.pageIndex, this.pageSize).subscribe(
      (resp: any) => {
        this.ClientData = resp.appointmentData;
        this.processReportData(resp.reportData);
      }
    );
  }

  // Getting Report Data into key-pair value form 
  processReportData(reportData: any) {
    const seriesData: ChartData[] = [];
  
    const dataKeys = Object.keys(reportData).filter(key => key !== 'Date' && key !== 'Description' && key !== 'Medicine');
  
    dataKeys.forEach(key => {
      const series: ChartData = {
        name: key,
        series: []
      };
      for (let i = 0; i < reportData.Date.length; i++) {
        series.series.push({
          name: reportData.Date[i],
          value: parseFloat(reportData[key][i])
        });
      }
      seriesData.push(series);
    });
    this.chartData = seriesData;
  }
  

  Download(FileName: any) {
    this.appointService.getDownload(FileName).subscribe(
      (blob: Blob) => {
        const blob1 = new Blob([blob], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob1);
        const link = document.createElement('a');
        link.href = url;
        link.download = FileName + '.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error downloading report:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to download report!',
        });
      }
    );
  }


  OnSelectReportData(FileName: any) {
    this.appointService.getDownload(FileName).subscribe(
      (response: any) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
      },
      (error) => {
        console.error('Error fetching PDF:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch PDF!',
        });
      }
    );
  }


  onPageChange(pageIndex: number) {
    if (pageIndex >= 0) {
      this.pageIndex = pageIndex;
      this.getPatientById();
    }
  }

  getPaginationIndices() {
    const totalPages = Math.ceil(this.ClientData.length / this.pageSize);
    return Array.from(Array(totalPages).keys());
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


}