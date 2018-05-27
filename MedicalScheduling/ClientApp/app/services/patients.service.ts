import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class PatientService {
    myAppUrl: string = "";

    constructor(private _http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.myAppUrl = baseUrl;
    }
    
    getPatients(pageNumber: number, pageSize: number) {
        return this._http.get(this.myAppUrl + 'api/GetAllPatients?pageNumber=' + pageNumber + '&pageSize=' + pageSize)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    getPatientById(id: number) {
        return this._http.get(this.myAppUrl + "api/GetPatient/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    savePatient(user:any) {
        return this._http.post(this.myAppUrl + 'api/AddPatient/', user)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    updatePatient(id:number, user:any) {
        return this._http.put(this.myAppUrl + 'api/UpdatePatient/' + id, user)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    deletePatient(id:number) {
        return this._http.delete(this.myAppUrl + "api/DeletePatient/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }
}