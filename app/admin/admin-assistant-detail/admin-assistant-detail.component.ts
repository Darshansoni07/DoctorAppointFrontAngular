import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminAccountService } from 'src/app/service/admin-account.service';
import { UserAccountService } from 'src/app/service/user-account.service';

@Component({
  selector: 'app-admin-assistant-detail',
  templateUrl: './admin-assistant-detail.component.html',
  styleUrls: ['./admin-assistant-detail.component.css']
})
export class AdminAssistantDetailComponent implements OnInit {

  updateForm!: FormGroup;
  AssistantData: any[] = [];
  showModal: boolean = false;

  pageIndex: number = 0;
  pageSize: number = 5;
  totalpage: number = 0;

  userCurrentData: any;
  clientId: any;

  constructor(private account_Service: UserAccountService,
    private admin_Service: AdminAccountService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.methodsActivate();
    //this.createUpdate();    
  }

  methodsActivate() {
    this.getAllCilent();
  }

  //------------------Get All Client Data
  getAllCilent() {

    this.admin_Service.getAllAssistant(this.pageIndex, this.pageSize).subscribe((res: any) => {
      this.AssistantData = res.data;
      this.totalpage = res.totalCount;
      console.log("Assistant Doctor data:", res);
    },
      (error) => {
        console.log(error);
      });
  }

  //----------------------Get Client data by Id
  onSelectById(Id: any) {
    debugger
    localStorage.setItem("UserId", Id);
    if (Id) {
      this.admin_Service.getClientById(Id).subscribe(
        res => {
          if (res) {
            debugger
            this.userCurrentData = res;
          }
          console.log(res);
          //this.createUpdate();
          this.showModal = true;
        }
      );
    }


    //console.log(this.MetaDataClient);
  }





  onPageChange(pageIndex: number) {
    if (pageIndex >= 0) {
      this.pageIndex = pageIndex;
      this.getAllCilent();
    }
  }

  getPaginationIndices() {
    const totalPages = Math.ceil(this.AssistantData.length / this.pageSize);
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



  closeModal() {
    this.showModal = false;
  }

}
