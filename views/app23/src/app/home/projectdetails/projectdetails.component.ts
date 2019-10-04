import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, SupplierService, CompositionsService, SlumpService, NotificationService, MaterialService, ParsService, ItemsService, RmesService, ReceivedService, ParsLinksService, TaskService, DelayService } from '../../_services';
import { ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
//loading spinner
import { NgxSpinnerService } from 'ngx-spinner';
import { empty, EMPTY } from 'rxjs';
import { createOfflineCompileUrlResolver } from '@angular/compiler';

@Component({
  selector: 'app-projectdetails',
  templateUrl: './projectdetails.component.html',
  styleUrls: ['./projectdetails.component.css']
})
export class ProjectdetailsComponent implements OnInit {

  project: any;
  user: any;

  // THIS APP
  newDelayForm: FormGroup;
  taskList: any;
  nextaction: any = { show: false };
  submitted : boolean;

  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private authentication: AuthenticationService,
    private fb: FormBuilder,
    private alert: ToastrService,
    private spinner: NgxSpinnerService,
    private notificationservice: NotificationService,
    private taskservice: TaskService,
    private delayservice : DelayService
  ) { }

  createTaskForm() {
    //register the new task form
    this.newDelayForm = this.fb.group({
      description: ['', Validators.required],
      task: ['', Validators.required],
      impact: ['', Validators.required],
      days: ['', Validators.required]
    });
  }
  getTaskByProject() {
    this.taskservice.getAll(this.router.snapshot.paramMap.get("idproject")).subscribe(data => {
      console.log(data);
      this.taskList = [];
      this.taskList = data;
    }, err => {

    })
  }

  ngOnInit() {
    this.createTaskForm();
    this.getTaskByProject();

    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user
    }
  }


  //getter
  get f() { return this.newDelayForm.controls }

  onSubmit() {
    this.submitted = true;
    console.log(this.newDelayForm);
    if (this.newDelayForm.invalid) {
      return;
    }
    this.delayservice.create(this.f.description.value, this.f.impact.value, this.f.task.value.idtask, this.f.days.value).subscribe( data => {
      this.alert.success("Delay is created");
      this.submitted = false;
      this.newDelayForm.reset();
    }, err=> {
      this.alert.error("Delays is not created");
    })
  }

  checkTaskStatus(task: any){
    let endDate = new Date(task.edate);
    let startDate = new Date(task.sdate);
    let now = new Date();
    if(now.getTime() > endDate.getTime() && now.getTime() > startDate.getTime()){
      return true
    }
    return false;
  }
  giveTaskFinishedID(task:any){
    let endDate = new Date(task.edate);
    let startDate = new Date(task.sdate);
    let now = new Date();
    if(now.getTime() > endDate.getTime() && now.getTime() > startDate.getTime()){
      return "(Task Closed)"
    }
    return "";
  }

}
