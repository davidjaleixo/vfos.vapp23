import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, TaskService, DelayService } from 'src/app/_services';
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { del } from 'selenium-webdriver/http';
import { ChartSelectEvent, ChartMouseOverEvent } from 'ng2-google-charts';
import * as $ from 'jquery';

import { dateLessValidator, dateDependecyValidator } from 'src/app/_helpers';


// function dateValidator(control: FormControl) {
//   console.log("dateValidator processing with form control:", control);

//   if (control.value !== undefined) {
//     return { 'enddateError': true };
//   }
//   return null;

// }

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
  taskList: any = [];
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
      height: 80,
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
    private rou: Router,
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
    
    this.delaysList = [];
  }
  convertDate(date: string) {
    return new Date(date);
  }
  createTaskForm() {
    //register the new task form
    this.newTaskForm = this.fb.group({
      name: ['', Validators.required],
      startdate: ['', Validators.required],
      enddate: ['', Validators.required],
      after: ['', Validators.required]
    }, { validator: [dateLessValidator('startdate', 'enddate'), dateDependecyValidator('after', 'startdate')] });
  }
  validateDate(group: FormGroup) {
    ///TODO: Implement some better validation logic
    const invalid = group.get('startDate').value > group.get('endDate').value;
    ///TODO: Implement some logic to mark controls dirty if is necessary.

    return invalid ? { 'invalidDate': true } : null;
  }
  getDelaysByProject() {
    this.delayservice.getAll(this.router.snapshot.paramMap.get("idproject")).subscribe(data => {
      this.delaysList = [];
      this.delaysList = data;
      console.log("delays");
      console.log(this.delaysList);
    })
  }

  diffInDates(firstDate: Date, lastDate: Date) {
    let now = new Date();

    if (now.getTime() > lastDate.getTime() && now.getTime() > firstDate.getTime()) {
      return 100;
    }
    if (now.getTime() < lastDate.getTime() && now.getTime() < firstDate.getTime()) {
      return 0;
    }

    let diff = ((lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24)) + 1;

    let diffNow = ((now.getTime() - firstDate.getTime()) / (1000 * 3600 * 24));
    console.log("diff:", diff, "diffNow", diffNow);
    return Math.ceil(diffNow * 100 / diff);
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
        console.log("First: ", new Date(eachTask.sdate), "Second: ", new Date(eachTask.edate), this.diffInDates(new Date(eachTask.sdate), new Date(eachTask.edate)))
        if (!eachTask.place || eachTask.place == 0) {
          taskListen.push([eachTask.idtask, eachTask.name, new Date(eachTask.sdate), new Date(eachTask.edate), null, this.diffInDates(new Date(eachTask.sdate), new Date(eachTask.edate)), null]);
        } else {
          taskListen.push([eachTask.idtask, eachTask.name, new Date(eachTask.sdate), new Date(eachTask.edate), null, this.diffInDates(new Date(eachTask.sdate), new Date(eachTask.edate)), eachTask.place]);
        }

        if (idx == arr.length - 1) {

          this.ganttChart = Object.create(this.ganttChart);
          this.ganttChart.dataTable = taskListen
          //update chart size
          this.ganttChart.options =
            {
              height: 40 * taskListen.length,
              gantt: {
                criticalPathEnabled: false,
                trackHeight: 30,
                arrow: {
                  width: 5,
                  color: '#471E68'
                }
              }
            };
          console.log("attaching new gantt data...", this.ganttChart);
          // let chartcomp = this.ganttChart;
          // this.ganttChart.component.wrapper
          // chartcomp.draw();
          // this.ganttChart.component.wrapper.draw();
        }
      })
    }, err => {

    })
  }
  isValidDate(d) {
    return d instanceof Date;
  }
  validateDependecy() {
    // console.log("Running validateDependecy...");
    // console.log("after value: ", this.f.after.value);
    if (this.f.after.value == "None" || this.f.after.value == null) { return true }

    let depEndDate = new Date(this.f.after.value.edate);
    return (depEndDate >= new Date(this.f.startdate.value) && this.isValidDate(depEndDate)) ? false : true;
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let f = group.controls[from];
      let t = group.controls[to];
      console.log("Validating: Comparing dates: ", f.value, "---", t.value);
      if (f.value > t.value) {
        console.log("dateLessThan returning error")
        return {
          dates: "Date from should be less than Date to"
        };

      }
      console.log("dateLessThan not returning error")
      return {};
    }
  }

  ngOnInit() {
    $(document).ready(function () {
      $(document).on('click', '.pull-bs-canvas-right, .pull-bs-canvas-left', function () {
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
        this.rou.navigate(['/home/projects/' + this.router.snapshot.paramMap.get("idproject") + '/rescheduler/' + delayObj.iddelay]);
      } else {

      }
    } else {
      //simply accept this delay
      this.delayservice.accept(delayObj.iddelay, true).subscribe(data => {
        this.alert.success("Delay has been accepted");
        this.getDelaysByProject();
      })
    }
  }

  reject(delayObj) {
    this.delayservice.accept(delayObj.iddelay, false).subscribe(data => {
      this.alert.success("Delay has been rejected");
      this.getDelaysByProject();
    })
  }

  deleteTask() {
    let stopit = false;
    this.taskList.forEach((eachTask, idx, array) => {
      if (eachTask.place == this.selectedTask.idtask) {
        this.alert.error("This task has dependent tasks. Delete them first")
        stopit = true;
      }
      if (idx == array.length - 1 && !stopit) {
        this.taskservice.delete(this.selectedTask.idtask).subscribe(data => {
          this.alert.success("Task deleted");
          this.getTaskByProject();
        }, err => {
          this.alert.error("Task not deleted");
        })
      }
    });

  }
  applyTaskChanges() {
    // this.alert.warning("NOT IMPLEMENTED");
    console.log(this.selectedTask);
    this.taskservice.update(this.selectedTask).subscribe(data => {
      this.alert.success("Task updated");
      this.getTaskByProject();
    }, err => {
      this.alert.error("Task not updated");
    })
  }
  parseDate(dateString: string): any {
    if (dateString) {
      return new Date(dateString).toDateString();
    }
    return null;
  }

  public selectChart(event: ChartSelectEvent) {
    console.log("event click on chart");
    console.log(event);
    if (event.message == 'select') {
      // this.showSelectedPane = true;
      this.taskList.forEach(eachTask => {
        if (eachTask.idtask == event.selectedRowValues[0]) {
          this.selectedTask = eachTask;
          // this.selectedTask.sdate = this.selectedTask.sdate;
          // this.selectedTask.edate = new Date(this.selectedTask.edate);
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
          this.newTaskForm.reset({ after: this.f.after.value });
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
        this.newTaskForm.reset({ after: 'None' });
        this.getTaskByProject();

      }, err => {
        this.alert.error("Task was not created");
      })
    }


  }

}
