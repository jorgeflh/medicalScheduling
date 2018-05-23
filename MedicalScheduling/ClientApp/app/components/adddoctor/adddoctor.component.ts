import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FetchDoctorComponent } from '../fetchdoctor/fetchdoctor.component';
import { DoctorService } from '../../services/doctors.service';

@Component({
    templateUrl: './adddoctor.component.html'
})

export class CreateDoctor implements OnInit {
    doctorForm: FormGroup;
    title: string = "Create";
    id: number = 0;
    errorMessage: any;

    constructor(private _fb: FormBuilder, private _avRoute: ActivatedRoute,
        private _doctorService: DoctorService, private _router: Router) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }

        this.doctorForm = this._fb.group({
            id: 0,
            name: ['', [Validators.required]],
        })
    }

    ngOnInit() {

        if (this.id > 0) {
            this.title = "Edit";
            this._doctorService.getDoctorById(this.id)
                .subscribe(resp => this.doctorForm.setValue(resp)
                    , error => this.errorMessage = error);
        }
    }

    save() {
        if (!this.doctorForm.valid) {
            return;
        }

        if (this.title == "Create") {
            this._doctorService.saveDoctor(this.doctorForm.value)
                .subscribe((data) => {
                    this._router.navigate(['/fetch-doctor']);
                }, error => this.errorMessage = error)
        }
        else if (this.title == "Edit") {
            this._doctorService.updateDoctor(this.doctorForm.controls['id'].value, this.doctorForm.value)
                .subscribe((data) => {
                    this._router.navigate(['/fetch-doctor']);
                }, error => this.errorMessage = error)
        }
    }

    cancel() {
        this._router.navigate(['/fetch-doctor']);
    }

    get name() { return this.doctorForm.get('name')!.value; }
}