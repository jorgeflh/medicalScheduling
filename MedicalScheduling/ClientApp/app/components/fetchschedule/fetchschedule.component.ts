import { Component, OnInit, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute, Data } from '@angular/router';
import { ScheduleService } from '../../services/schedules.service';
import { DoctorService } from '../../services/doctors.service';

@Component({
    templateUrl: './fetchschedule.component.html'
})

export class FetchScheduleComponent {
    public scheduleList: ScheduleData[] = [];
    public doctorList: DoctorData[] = [];

    constructor(public http: Http, private _router: Router, private _scheduleService: ScheduleService, private _doctorService: DoctorService) {
        this.getSchedules();
        this.getDoctors();
    }

    ngOnInit() {
        console.log(this.doctorList);
    }

    getSchedules(id:number = 0) {
        this._scheduleService.getSchedules(id).subscribe(
            data => this.scheduleList = data
        )
    }

    getDoctors() {
        this._doctorService.getDoctors().subscribe(
            data => this.doctorList = data
        )
    }

    delete(id:number) {
        var ans = confirm("Você quer deletar o agendamento de Id: " + id);
        if (ans) {
            this._scheduleService.deleteSchedule(id).subscribe((data) => {
                this.getSchedules();
            }, error => console.error(error))
        }
    }
}

interface ScheduleData {
    id: number;
    doctorId: number;
    doctorName: string;
    patientId: number;
    patientName: string;
    date: string;
    time: string;
}

interface DoctorData {
    id: number;
    name: string;
}