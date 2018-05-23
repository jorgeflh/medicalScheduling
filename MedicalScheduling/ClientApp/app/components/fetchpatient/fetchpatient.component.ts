import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patients.service'

@Component({
    templateUrl: './fetchpatient.component.html'
})

export class FetchPatientComponent {
    public patientsList: PatientData[];

    constructor(public http: Http, private _router: Router, private _patientService: PatientService) {
        this.getPatients();
    }

    getPatients() {
        this._patientService.getPatients().subscribe(
            data => this.patientsList = data
        )
    }

    delete(id:number) {
        var ans = confirm("Você quer deletar o paciente de Id: " + id);
        if (ans) {
            this._patientService.deletePatient(id).subscribe((data) => {
                this.getPatients();
            }, error => console.error(error))
        }
    }
}

interface PatientData {
    id: number;
    name: string;
}