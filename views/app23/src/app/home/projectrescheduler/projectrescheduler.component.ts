import { Component, OnInit } from '@angular/core';
import { ProjectService, AuthenticationService, TaskService, DelayService } from 'src/app/_services';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GoogleChartInterface } from 'ng2-google-charts/google-charts-interfaces';
import { ChartReadyEvent, ChartErrorEvent } from 'ng2-google-charts';

@Component({
  selector: 'app-projectrescheduler',
  templateUrl: './projectrescheduler.component.html',
  styleUrls: ['./projectrescheduler.component.css']
})
export class ProjectreschedulerComponent implements OnInit {

  impactdays = 1;
  project: any;
  user: any;
  transform: any;
  tasks: GoogleChartInterface;
  newTaskForm: FormGroup;
  submitted: boolean;
  taskList: any = [];
  delaysList: any;
  delay: any;
  showReschedule: boolean = false;


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
  public rescheduledGantt: GoogleChartInterface = {
    chartType: 'Gantt',
    dataTable: [],
    opt_firstRowIsData: false,
    options: {
      height: 200,
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
      height: 200,
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
    private rout: Router,
    private authentication: AuthenticationService,
    private taskservice: TaskService,
    private fb: FormBuilder,
    private alert: ToastrService,
    private delayservice: DelayService) {
    //create new task form


    //get tasks for this project
    this.getTaskByProject();

    //get delay for the rescheduler
    this.getDelay();
  }

  getDelay() {
    this.delayservice.getById(this.router.snapshot.paramMap.get("iddelay")).subscribe(data => {
      this.delay = data;
      this.impactdays = +this.delay.impactdays
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
      // this.taskList = [];
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
          taskListen.push([eachTask.idtask, eachTask.name, new Date(eachTask.sdate), new Date(eachTask.edate), null, this.diffInDates(new Date(eachTask.sdate), new Date(eachTask.edate)), null]);
        } else {
          taskListen.push([eachTask.idtask, eachTask.name, new Date(eachTask.sdate), new Date(eachTask.edate), null, this.diffInDates(new Date(eachTask.sdate), new Date(eachTask.edate)), eachTask.place]);
        }

        if (idx == arr.length - 1) {
          // force a reference update (otherwise Angular doesn't detect the change)
          this.ganttChart = Object.create(this.ganttChart);
          this.ganttChart.dataTable = taskListen
          this.ganttChart.options = {
            height: 40 * taskListen.length,
            gantt: {
              criticalPathEnabled: false,
              trackHeight: 30,
              arrow: {
                width: 5,
                color: '#471E68'
              }
            }
          }
          console.log("attaching new gantt data...", this.ganttChart);
          // this.ganttChart.component.draw();
        }
      })
    }, err => {

    })
  }


  public ready(event: ChartReadyEvent) {
    console.log("evento: ", event.message);
    console.log(event);
  }
  public error(event: ChartErrorEvent) {
    console.log("evento erro:", event.detailedMessage);
  }

  ngOnInit() {
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
  addDays(date: Date, days: number): Date {
    console.log('adding ' + days + ' days');
    console.log(date);
    date.setDate(date.getDate() + days);
    console.log(date);
    return date;
  }
  redirect() {
    this.rout.navigate(['/home/projects/' + this.router.snapshot.paramMap.get("idproject") + '/schedule'])
  }
  saveReschedule() {
    let result = confirm("Are you sure? This can't be undone.")
    if (result) {
      this.taskList.forEach((eachTask, idx, arr) => {
        this.taskservice.update(eachTask).subscribe(data => {
          this.alert.success("Task update");
        })
        if (idx == arr.length - 1) {
          this.delayservice.accept(this.router.snapshot.paramMap.get("iddelay"), true).subscribe(data => {
            this.alert.success("Delay was accepted. Project's task were rescheduled")
            this.alert.info("Project schedule was updated...")

            //update the schedule on top
            this.getTaskByProject();

          }, err => {
            this.alert.error("Error");
          })
        }
      })

    } else {
      return
    }
  }

  updateRescheduleChart() {
    console.log("updating rescheduledGantt...");
    let taskListen = [];
    taskListen.push([
      { label: 'Task ID', type: 'string' },
      { label: 'Task Name', type: 'string' },
      { label: 'Start', type: 'date' },
      { label: 'End', type: 'date' },
      { label: 'Duration', type: 'number' },
      { label: 'Percentage', type: 'number' },
      { label: 'Deps', type: 'string' }
    ]);
    this.taskList.forEach((eachTask, idx, arr) => {
      if (!eachTask.place || eachTask.place == 0) {
        taskListen.push([eachTask.idtask, eachTask.name, new Date(eachTask.sdate), new Date(eachTask.edate), null, this.diffInDates(new Date(eachTask.sdate), new Date(eachTask.edate)), null]);
      } else {
        taskListen.push([eachTask.idtask, eachTask.name, new Date(eachTask.sdate), new Date(eachTask.edate), null, this.diffInDates(new Date(eachTask.sdate), new Date(eachTask.edate)), eachTask.place]);
      }

      if (idx == arr.length - 1) {
        this.rescheduledGantt.dataTable = taskListen
        console.log(this.rescheduledGantt);
        this.showReschedule = true;
        this.rescheduledGantt.component.draw();
      }
    })
  }
  reschedule(affectedTaskId, init: boolean) {
    console.log("running rescheduler...");


    this.taskList.forEach((eachTask, idx, arr) => {
      //affect the impactedTask
      if (eachTask.idtask == affectedTaskId && init) {
        this.alert.info("Rescheduling task " + eachTask.name + "...");
        this.taskList[idx].edate = this.addDays(new Date(this.taskList[idx].edate), this.impactdays)
        // if(!init){
        //   this.taskList[idx].sdate = this.addDays(this.taskList[idx].sdate, this.impactdays)
        // }
      }
      //get direclty affected
      if (eachTask.place == affectedTaskId) {
        this.taskList[idx].sdate = this.addDays(new Date(this.taskList[idx].sdate), this.impactdays);
        this.taskList[idx].edate = this.addDays(new Date(this.taskList[idx].edate), this.impactdays);
        //iterate based on this hint
        this.reschedule(eachTask.idtask, false);
        this.alert.info("Rescheduling task " + eachTask.name + "...");
      }

      if (idx == arr - 1) {
        // this.updateRescheduleChart();
      }

    })
  }

}