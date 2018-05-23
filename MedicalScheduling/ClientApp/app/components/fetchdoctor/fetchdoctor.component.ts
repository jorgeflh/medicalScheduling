import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctors.service'

@Component({
    templateUrl: './fetchdoctor.component.html'
})

export class FetchDoctorComponent {
    public doctorsList: DoctorData[];

    constructor(public http: Http, private _router: Router, private _doctorService: DoctorService) {
        this.getDoctors();
    }

    getDoctors() {
        this._doctorService.getDoctors().subscribe(
            data => this.doctorsList = data
        )
    }

    delete(id:number) {
        var ans = confirm("Você quer deletar o médico de Id: " + id);
        if (ans) {
            this._doctorService.deleteDoctor(id).subscribe((data) => {
                this.getDoctors();
            }, error => console.error(error))
        }
    }
}

interface DoctorData {
    id: number;
    name: string;
}