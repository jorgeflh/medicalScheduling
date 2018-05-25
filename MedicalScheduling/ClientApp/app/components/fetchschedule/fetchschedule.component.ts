import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ScheduleService } from '../../services/schedules.service';

@Component({
    templateUrl: './fetchschedule.component.html'
})

export class FetchScheduleComponent {
    public scheduleList: ScheduleData[] = [];

    constructor(public http: Http, private _router: Router, private _scheduleService: ScheduleService) {
        this.getSchedules();
    }

    getSchedules() {
        this._scheduleService.getSchedules().subscribe(
            data => this.scheduleList = data
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
    patientId: number;
    date: string;
    time: string;
}