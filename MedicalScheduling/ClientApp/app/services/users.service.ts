import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class UserService {
    myAppUrl: string = "";

    constructor(private _http: Http, @Inject('BASE_URL') baseUrl: string) {
        this.myAppUrl = baseUrl;
    }
    
    getUsers() {
        return this._http.get(this.myAppUrl + 'api/GetAllUsers')
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    getUserById(id: number) {
        return this._http.get(this.myAppUrl + "api/GetUser/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    saveUser(user:any) {
        return this._http.post(this.myAppUrl + 'api/AddUser/', user)
            .map((response: Response) => response.json())
            .catch(this.errorHandler)
    }

    updateUser(id:number, user:any) {
        return this._http.put(this.myAppUrl + 'api/UpdateUser/' + id, user)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    deleteUser(id:number) {
        return this._http.delete(this.myAppUrl + "api/DeleteUser/" + id)
            .map((response: Response) => response.json())
            .catch(this.errorHandler);
    }

    errorHandler(error: Response) {
        console.log(error);
        return Observable.throw(error);
    }
}