import { Component, Inject, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patients.service'

@Component({
    templateUrl: './fetchpatient.component.html'
})

export class FetchPatientComponent {
    public paging: Paging;
    public link: Link[];
    public patientsList: PatientData[];
    public pageNumber = 1;
    public pageSize = 5;
    public pages = [];

    constructor(public http: Http, private _router: Router, private _patientService: PatientService) {
        this.getPatients(this.pageNumber, this.pageSize);
    }

    getPatients(pageNumber: number, pageSize: number) {
        this._patientService.getPatients(pageNumber, pageSize).subscribe(
            data => (this.paging = data.paging, this.link = data.links, this.patientsList = data.items),
            error => console.error(error)
        );
    }

    delete(id: number) {
        var ans = confirm("Você quer deletar o paciente de Id: " + id);
        if (ans) {
            this._patientService.deletePatient(id).subscribe((data) => {
                this.getPatients(this.pageNumber, this.pageSize);
            }, error => console.error(error))
        }
    }
}

interface Paging {
    totalItems: number,
    pageNumber: number,
    pageSize: number,
    totalPage: number
}

interface Link {
    href: string,
    rel: string,
    method: string
}

interface PatientData {
    id: number;
    name: string;
}