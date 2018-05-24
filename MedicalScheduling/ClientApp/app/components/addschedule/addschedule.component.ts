﻿import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FetchScheduleComponent } from '../fetchschedule/fetchschedule.component';
import { ScheduleService } from '../../services/schedules.service';

@Component({
    templateUrl: './addschedule.component.html'
})

export class CreateSchedule implements OnInit {
    scheduleForm: FormGroup;
    title: string = "Create";
    id: number = 0;
    errorMessage: any;

    constructor(private _fb: FormBuilder, private _avRoute: ActivatedRoute,
        private _scheduleService: ScheduleService, private _router: Router) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }

        this.scheduleForm = this._fb.group({
            id: 0,
            doctorId: ['', [Validators.required]],
            patientId: ['', [Validators.required]],
            date: ['', [Validators.required]]
        })
    }

    ngOnInit() {
        if (this.id > 0) {
            this.title = "Edit";
            this._scheduleService.getScheduleById(this.id)
                .subscribe(resp => this.scheduleForm.setValue(resp)
                    , error => this.errorMessage = error);
        }
    }

    save() {
        if (!this.scheduleForm.valid) {
            return;
        }

        if (this.title == "Create") {
            this._scheduleService.saveSchedule(this.scheduleForm.value)
                .subscribe((data) => {
                    this._router.navigate(['/fetch-schedule']);
                }, error => this.errorMessage = error)
        }
        else if (this.title == "Edit") {
            console.log("id = " + this.scheduleForm.controls['id'].value);
            this._scheduleService.updateSchedule(this.scheduleForm.controls['id'].value, this.scheduleForm.value)
                .subscribe((data) => {
                    this._router.navigate(['/fetch-schedule']);
                }, error => this.errorMessage = error)
        }
    }

    cancel() {
        this._router.navigate(['/fetch-schedule']);
    }

    get doctorId() { return this.scheduleForm.get('doctorId')!.value; }
    get patientId() { return this.scheduleForm.get('patientId')!.value; }
    get date() { return this.scheduleForm.get('date')!.value; }
}