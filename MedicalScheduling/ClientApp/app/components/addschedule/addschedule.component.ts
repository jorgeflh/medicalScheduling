import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
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
    timeList = new Array<string>();
    flagDoctor: boolean = true;
    flagPatient: boolean = true;
    searchDoctorTerms = new Subject<string>();
    searchPatientTerms = new Subject<string>();
    doctors: Observable<any[]>;
    patients: Observable<any[]>;

    constructor(private _fb: FormBuilder, private _avRoute: ActivatedRoute,
        private _scheduleService: ScheduleService, private _router: Router) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }

        this.scheduleForm = this._fb.group({
            id: 0,
            doctorId: ['', [Validators.required]],
            doctorName: ['', [Validators.required]],
            patientId: ['', [Validators.required]],
            patientName: ['', [Validators.required]],
            date: ['', [Validators.required]],
            time: ['', [Validators.required]]
        });
    }

    ngOnInit() {
        if (this.id > 0) {
            this.title = "Edit";
            this._scheduleService.getScheduleById(this.id)
                .subscribe(resp => this.scheduleForm.setValue(resp)
                , error => this.errorMessage = error);

            this._scheduleService.getScheduleById(this.id)
                .subscribe(resp => console.log(resp), error => this.errorMessage = error);
        }

        for (var i = 8; i <= 18; i++) {
            if (i < 10)
                this.timeList.push("0" + i + ":00");
            else
                this.timeList.push(i + ":00");
        }

        this.doctors = this.searchDoctorTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => term ? this._scheduleService.searchDoctor(term) : Observable.of<any[]>([]))
            .catch(error => {
                console.log(error);
                return Observable.of<any[]>([]);
            });  

        this.patients = this.searchPatientTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => term ? this._scheduleService.searchPatient(term) : Observable.of<any[]>([]))
            .catch(error => {
                console.log(error);
                return Observable.of<any[]>([]);
            });  
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
    get doctorName() { return this.scheduleForm.get('doctorName')!.value; }
    get patientId() { return this.scheduleForm.get('patientId')!.value; }
    get patientName() { return this.scheduleForm.get('patientName')!.value; }
    get date() { return this.scheduleForm.get('date')!.value; }
    get time() { return this.scheduleForm.get('time')!.value; }

    // Fetch doctors
    searchDoctor(term: string): void {
        this.flagDoctor = true;
        this.searchDoctorTerms.next(term);
    }

    onselectDoctor(DoctorObj:any) {
        if (DoctorObj.doctorId != 0) {
            this.scheduleForm.get('doctorId')!.setValue(DoctorObj.id);
            this.scheduleForm.get('doctorName')!.setValue(DoctorObj.name);
            this.flagDoctor = false;
        }
        else {
            return false;
        }
    }  

    // Fetch patients
    searchPatient(term: string): void {
        this.flagPatient = true;
        this.searchPatientTerms.next(term);
    }

    onselectPatient(PatientObj: any) {
        if (PatientObj.patientId != 0) {
            this.scheduleForm.get('patientId')!.setValue(PatientObj.id);
            this.scheduleForm.get('patientName')!.setValue(PatientObj.name);
            this.flagPatient = false;
        }
        else {
            return false;
        }
    }  
}