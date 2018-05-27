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
    public paging?: Paging;
    public link: Link[] = [];
    public pageNumber = 1;
    public pageSize = 5;
    public pages = [];

    constructor(public http: Http, private _router: Router, private _scheduleService: ScheduleService, private _doctorService: DoctorService) {
        this.getSchedules(this.pageNumber, this.pageSize);
        this.getDoctors();
    }

    getSchedules(pageNumber: number, pageSize: number, id:number = 0) {
        this._scheduleService.getSchedules(pageNumber, pageSize, id).subscribe(
            data => (this.paging = data.paging, this.link = data.links, this.scheduleList = data.items)
        )
    }

    getDoctors() {
        this._doctorService.getDoctorsList().subscribe(
            data => this.doctorList = data
        )
    }

    delete(id:number) {
        var ans = confirm("Você quer deletar o agendamento de Id: " + id);
        if (ans) {
            this._scheduleService.deleteSchedule(id).subscribe((data) => {
                this.getSchedules(this.pageNumber, this.pageSize);
            }, error => console.error(error))
        }
    }
}

interface Paging {
    totalItems: number,
    pageNumber: number,
    pageSize: number,
    totalPages: number
}

interface Link {
    href: string,
    rel: string,
    method: string
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