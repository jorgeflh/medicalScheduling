import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class DoctorService {
    myAppUrl: string = "";

    constructor(private _http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.myAppUrl = baseUrl;
    }
    
    getDoctors() {
        return this._http.get(this.myAppUrl + 'api/GetAllDoctors')
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    getDoctorById(id: number) {
        return this._http.get(this.myAppUrl + "api/GetDoctor/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    saveDoctor(user:any) {
        return this._http.post(this.myAppUrl + 'api/AddDoctor/', user)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    updateDoctor(id:number, user:any) {
        return this._http.put(this.myAppUrl + 'api/UpdateDoctor/' + id, user)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    deleteDoctor(id:number) {
        return this._http.delete(this.myAppUrl + "api/DeleteDoctor/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }
}