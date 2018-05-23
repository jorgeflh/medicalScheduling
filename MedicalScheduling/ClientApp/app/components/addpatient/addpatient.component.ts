import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FetchPatientComponent } from '../fetchpatient/fetchpatient.component';
import { PatientService } from '../../services/patients.service';

@Component({
    templateUrl: './addpatient.component.html'
})

export class CreatePatient implements OnInit {
    patientForm: FormGroup;
    title: string = "Create";
    id: number = 0;
    errorMessage: any;

    constructor(private _fb: FormBuilder, private _avRoute: ActivatedRoute,
        private _patientService: PatientService, private _router: Router) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }

        this.patientForm = this._fb.group({
            id: 0,
            name: ['', [Validators.required]],
        })
    }

    ngOnInit() {

        if (this.id > 0) {
            this.title = "Edit";
            this._patientService.getPatientById(this.id)
                .subscribe(resp => this.patientForm.setValue(resp)
                    , error => this.errorMessage = error);
        }
    }

    save() {
        if (!this.patientForm.valid) {
            return;
        }

        if (this.title == "Create") {
            this._patientService.savePatient(this.patientForm.value)
                .subscribe((data) => {
                    this._router.navigate(['/fetch-patient']);
                }, error => this.errorMessage = error)
        }
        else if (this.title == "Edit") {
            this._patientService.updatePatient(this.patientForm.controls['id'].value, this.patientForm.value)
                .subscribe((data) => {
                    this._router.navigate(['/fetch-patient']);
                }, error => this.errorMessage = error)
        }
    }

    cancel() {
        this._router.navigate(['/fetch-patient']);
    }

    get name() { return this.patientForm.get('name')!.value; }
}