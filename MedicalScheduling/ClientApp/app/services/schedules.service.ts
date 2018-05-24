import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ScheduleService {
    myAppUrl: string = "";

    constructor(private _http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.myAppUrl = baseUrl;
    }
    
    getSchedules() {
        return this._http.get(this.myAppUrl + 'api/GetAllSchedules')
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    getScheduleById(id: number) {
        return this._http.get(this.myAppUrl + "api/GetSchedule/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    saveSchedule(schedule:any) {
        return this._http.post(this.myAppUrl + 'api/AddSchedule/', schedule)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    updateSchedule(id:number, schedule:any) {
        return this._http.put(this.myAppUrl + 'api/UpdateSchedule/' + id, schedule)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    deleteSchedule(id:number) {
        return this._http.delete(this.myAppUrl + "api/DeleteSchedule/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }
}