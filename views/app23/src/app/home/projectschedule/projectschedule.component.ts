import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, TaskService, DelayService } from 'src/app/_services';
import { ActivatedRoute } from "@angular/router";
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { del } from 'selenium-webdriver/http';
import { ChartSelectEvent, ChartMouseOverEvent } from 'ng2-google-charts';
import * as $ from 'jquery';

@Component({
  selector: 'app-projectschedule',
  templateUrl: './projectschedule.component.html',
  styleUrls: ['./projectschedule.component.css']
})
export class ProjectscheduleComponent implements OnInit {

  tasktoshowhint: boolean = false;
  showSelectedPane: boolean = false;
  selectedTask: any;
  project: any;
  user: any;
  transform: any;
  model;
  tasks: GoogleChartInterface;
  newTaskForm: FormGroup;
  submitted: boolean;
  taskList: any;
  delaysList: any;


  public timelineChart: GoogleChartInterface = {
    chartType: 'Timeline',
    dataTable: [
      [
        { label: 'Name', type: 'string' },
        { label: 'Start', type: 'date' },
        { label: 'End', type: 'date' }
      ],
      ['\0', new Date(), new Date()],
      ['Washington', new Date(2019, 9, 30), new Date(2019, 10, 4)],
      ['Adams', new Date(2019, 12, 4), new Date(2019, 12, 14)],
      ['Jefferson', new Date(2019, 10, 22), new Date(2019, 11, 14)]
    ]
  }


  public ganttChart: GoogleChartInterface = {
    chartType: 'Gantt',
    dataTable: [
      [
        { label: 'Task ID', type: 'string' },
        { label: 'Task Name', type: 'string' },
        { label: 'Start', type: 'date' },
        { label: 'End', type: 'date' },
        { label: 'Duration', type: 'number' },
        { label: 'Percentage', type: 'number' },
        { label: 'Deps', type: 'string' }
      ],
      ['now', '\0', new Date(), new Date(), null, 0, null],
      ['001', 'Task 1', new Date(2019, 1, 20), new Date(2019, 2, 10), null, 10, null],
      ['002', 'Task 2', new Date(2019, 4, 1), new Date(2019, 6, 14), null, 25, null],
      ['003', 'Task 3', new Date(2019, 7, 22), new Date(2019, 8, 16), null, 50, null],
      ['004', 'Task 4', new Date(2020, 8, 25), new Date(2020, 9, 26), null, 100, '003']
    ],
    opt_firstRowIsData: false,
    options: {
      height: 400,
      gantt: {
        criticalPathEnabled: false,
        trackHeight: 30,
        arrow: {
          width: 5,
          color: '#471E68'
        }
      }
    }
  }



  constructor(
    private projectservice: ProjectService,
    private router: ActivatedRoute,
    private authentication: AuthenticationService,
    private taskservice: TaskService,
    private fb: FormBuilder,
    private alert: ToastrService,
    private delayservice: DelayService) {
    //create new task form
    this.createTaskForm();

    //get tasks for this project
    this.getTaskByProject();

    //get delays for this project
    this.getDelaysByProject();
  }
  convertDate(date: string){
    return new Date(date);
  }
  createTaskForm() {
    //register the new task form
    this.newTaskForm = this.fb.group({
      name: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      after: ['', Validators.required]
    }, { validator: this.dateLessThan('startdate', 'enddate') });
  }
  getDelaysByProject() {
    this.delayservice.getAll(this.router.snapshot.paramMap.get("idproject")).subscribe(data => {
      this.delaysList = [];
      this.delaysList = data;
      console.log("delays");
      console.log(this.delaysList);
    })
  }
  getTaskByProject() {
    this.taskservice.getAll(this.router.snapshot.paramMap.get("idproject")).subscribe(data => {
      console.log(data);
      this.taskList = [];
      this.taskList = data;
      // this.taskList.push({name: "None"});
      //convert data for task scheduler
      let taskListen = [];
      this.transform = data;
      taskListen.push([
        { label: 'Task ID', type: 'string' },
        { label: 'Task Name', type: 'string' },
        { label: 'Start', type: 'date' },
        { label: 'End', type: 'date' },
        { label: 'Duration', type: 'number' },
        { label: 'Percentage', type: 'number' },
        { label: 'Deps', type: 'string' }
      ]);
      this.transform.forEach((eachTask, idx, arr) => {
        if (!eachTask.place || eachTask.place == 0) {
          taskListen.push([eachTask.idtask, eachTask.name, new Date(eachTask.sdate), new Date(eachTask.edate), null, 20, null]);
        } else {
          taskListen.push([eachTask.idtask, eachTask.name, new Date(eachTask.sdate), new Date(eachTask.edate), null, 20, eachTask.place]);
        }

        if (idx == arr.length - 1) {

          this.ganttChart.dataTable = taskListen
          console.log("attaching new gantt data...", this.ganttChart);
          this.ganttChart.component.draw();
        }
      })
    }, err => {

    })
  }
  isValidDate(d) {
    return d instanceof Date;
  }
  validateDependecy() {
    if (this.f.after.value == "None") { return true }

    let depEndDate = new Date(this.f.after.value.edate);
    return (depEndDate >= new Date(this.f.startdate.value) && this.isValidDate(depEndDate)) ? false : true;
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Date from should be less than Date to"
        };
      }
      return {};
    }
  }

  ngOnInit() {
    $(document).ready(function () {
      console.log("ready!**************************ready!**************************ready!**************************ready!**************************ready!**************************");
      $(document).on('click', '.pull-bs-canvas-right, .pull-bs-canvas-left', function () {
        console.log("click");
        $('body').prepend('<div class="bs-canvas-overlay position-fixed w-100 h-100"></div>');
        if ($(this).hasClass('pull-bs-canvas-right'))
          $('.bs-canvas-right').addClass('mr-0');
        else
          $('.bs-canvas-left').addClass('ml-0');
        return false;
      });

      $(document).on('click', '.bs-canvas-close, .bs-canvas-overlay', function () {
        console.log("click close");
        var elm = $(this).hasClass('bs-canvas-close') ? $(this).closest('.bs-canvas') : $('.bs-canvas');
        elm.removeClass('mr-0 ml-0');
        $('.bs-canvas-overlay').remove();
        return false;
      });
    });


    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data;
      }, err => {
        console.log(err);
      }
    )

    //get user details
    let user = this.authentication.getUserDetails();
    if (user != null) {
      this.user = user
    }
  }

  //form newTask getter
  get f() { return this.newTaskForm.controls }

  accept(delayObj) {
    if (delayObj.impactlevel == '2') {
      //check if the introduced value is outside of the thresholds
      let result = confirm("By accepting a delay with HIGH impact, the project rescheduler must be opened. Do you want to open it?");
      if (result) {

      } else {

      }
    } else {

    }
  }

  reject(delayObj) {

  }


  public selectChart(event: ChartSelectEvent) {
    console.log("event click on chart");
    console.log(event);
    if (event.message == 'select') {
      // this.showSelectedPane = true;
      this.taskList.forEach(eachTask => {
        if (eachTask.idtask == event.selectedRowValues[0]) {
          this.selectedTask = eachTask;
          this.selectedTask.sdate = new Date(this.selectedTask.sdate);
          this.selectedTask.edate = new Date(this.selectedTask.edate);
          $('body').prepend('<div class="bs-canvas-overlay position-fixed w-100 h-100"></div>');

          $('.bs-canvas-right').addClass('mr-0');
          return
        }
      })

    } else {
      // this.showSelectedPane = false;
      var elm = $(this).hasClass('bs-canvas-close') ? $(this).closest('.bs-canvas') : $('.bs-canvas');
      elm.removeClass('mr-0 ml-0');
      $('.bs-canvas-overlay').remove();
    }
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.newTaskForm);
    if (this.newTaskForm.invalid) {
      return;
    }
    if (this.f.after.value || this.f.after.value != "None") {
      if (this.validateDependecy()) {
        this.taskservice.create(this.f.name.value, this.router.snapshot.paramMap.get("idproject"), this.f.after.value.idtask, this.f.startdate.value, this.f.enddate.value).subscribe(data => {
          this.alert.success('Task created');
          this.submitted = false;
          this.newTaskForm.reset();
          this.getTaskByProject();

        }, err => {
          this.alert.error('Task was not created');
        })
      } else {
        return;
      };
    } else {
      this.taskservice.create(this.f.name.value, this.router.snapshot.paramMap.get("idproject"), 0, this.f.startdate.value, this.f.enddate.value).subscribe(data => {
        this.alert.success('Task created');
        this.submitted = false;
        this.newTaskForm.reset();
        this.getTaskByProject();

      }, err => {
        this.alert.error("Task was not created");
      })
    }


  }

}
