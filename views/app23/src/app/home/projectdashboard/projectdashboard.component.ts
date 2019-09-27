import { Component, OnInit } from '@angular/core';
import { ProjectService, ParsService, RmesService, MaterialReceivedService } from 'src/app/_services';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
  selector: 'app-projectdashboard',
  templateUrl: './projectdashboard.component.html',
  styleUrls: ['./projectdashboard.component.css']
})
export class ProjectdashboardComponent implements OnInit {

  project: any;
  pars: any;
  parstobe: any;
  rmes: any;
  mats: any;
  rmestobe: any;
  parinfo: any;
  parinfoitems: any;
  approvedrmes: any;
  parswithrmes: any;
  approvalrme: any;

  constructor(private projectservice: ProjectService,
    private router: ActivatedRoute,
    private parsservice: ParsService,
    private rmesservice: RmesService,
    private alert: ToastrService
  ) { }

  getPars() {
    this.parstobe = [];
    this.rmestobe = [];
    this.parsservice.getByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(data => {
      this.pars = data;
      this.getRmes();
    })
  }

  getRmes() {
    this.rmesservice.getByProject(this.router.snapshot.paramMap.get("idproject")).subscribe(listofrmes => {

      this.rmes = listofrmes;
      this.approvedrmes = 0;
      this.rmestobe = [];
      this.rmes.forEach(eachRme => {
        //count the approvals
        if (eachRme.status == "1") {
          this.approvedrmes = this.approvedrmes + 1

        }
      })

      //organize by pars
      this.parswithrmes = _.groupBy(this.rmes, "idpars");
      console.log("groupedbypars", JSON.stringify(this.parswithrmes));

      // for (let rmes of Object.values(this.parswithrmes)) {
      //   console.log(rmes);
      //   console.log(_.groupBy(rmes, "idroles"))
      // }
      // group by rmes_status for each par
      for(let key of Object.keys(this.parswithrmes)){
        console.log("key:",key,"value:",this.parswithrmes[key]);
        this.parswithrmes[key] = _.groupBy(this.parswithrmes[key], "status")
      }

      for(let par of Object.keys(this.parswithrmes)){
        console.log("checking par: ", par);
        //check if there is approvals
        if(this.parswithrmes[par]["null"]){
          this.rmestobe.push({parid: par, rmes: this.parswithrmes[par]["null"]}) 
        } 
      }
      
      //count approved qtd and merge with pars structure
      this.pars.forEach(eachPar => {
        eachPar.received = 0;
        for(let par of Object.keys(this.parswithrmes)){
          //search for approved rmes
          if(par == eachPar.idpars && this.parswithrmes[par]["1"]){
            this.parswithrmes[par]["1"].forEach(eachApprovedRme => {
              eachPar.received = eachPar.received + +eachApprovedRme.rmeqtd;
              
            })
          }
        }
      })
    })
  }

  ngOnInit() {
    this.pars = [];
    this.rmes = [];
    this.parstobe = [];
    this.projectservice.getProject(this.router.snapshot.paramMap.get("idproject")).subscribe(
      data => {
        console.log(data);
        this.project = data;
      }, err => {
        console.log(err);
      })
    this.getPars();
    // this.getRmes();
  }
  approvePar(parid) {
    console.log(parid)

  }
  rejectPar(parid) {
    console.log(parid)
    // this.parsservice.updateStatus(parid, 3).subscribe(data => {
    //   this.alert.success("PAR " + parid + " has been rejected!")
    //   this.getPars();
    // })
  }
  approveRme(rmetobeapproved) {
    console.log(rmetobeapproved)
    this.approvalrme = rmetobeapproved;
  }
  confirmRme(){
    if(!this.approvalrme.approvaldecision || this.approvalrme.approvaldecision == ""){
      this.alert.error("You need to add a comment");
    }
    
    this.rmesservice.updateStatus(this.approvalrme.idrmes, 1, this.approvalrme.approvaldecision).subscribe(
      data => {
        this.alert.success("You have approved the RME");
        this.getPars();
      }
    )
  }
  discardRme(){
    if(!this.approvalrme.approvaldecision || this.approvalrme.approvaldecision == ""){
      this.alert.error("You need to add a comment");
    }
    this.rmesservice.updateStatus(this.approvalrme.idrmes, 0, this.approvalrme.approvaldecision).subscribe(
      data => {
        this.alert.success("You have rejected the RME");
        this.getPars();
      }
    )
  }
  rejectRme(rmeid) {
    console.log(rmeid)
    // this.rmesservice.updateStatus(rmeid, 3).subscribe(data => {
    //   this.alert.success("RME " + rmeid + " has been rejected!")
    //   this.getPars();
    // })
  }
  showParInfo(parid) {
    this.parinfoitems = [];
    this.pars.forEach(eachPar => {
      this.mats.forEach(eachItem => {
        if (eachPar.idpars == parid && eachItem.idpars == parid) {
          this.parinfo = eachPar;
          //check if this item was already inserted
          let found = false;
          if (this.parinfoitems.length == 0) {
            this.parinfoitems.push(eachItem)
          } else {
            this.parinfoitems.forEach((eachItemInfo, idx, array) => {
              if (eachItemInfo.idlist == eachItem.idlist) {
                found = true;
              }
              if (idx == array.length - 1 && !found) {
                this.parinfoitems.push(eachItem)
                found = false;
              }
            })
          }


        }
      })
    })
  }
  showRmeInfo(parid) {

  }

}
