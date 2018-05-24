import { NgModule } from '@angular/core';
import { UserService } from './services/users.service';
import { DoctorService } from './services/doctors.service';
import { PatientService } from './services/patients.service';
import { ScheduleService } from './services/schedules.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchUserComponent } from './components/fetchusers/fetchuser.component';
import { CreateUser } from './components/adduser/adduser.component';
import { FetchDoctorComponent } from './components/fetchdoctor/fetchdoctor.component';
import { CreateDoctor } from './components/adddoctor/adddoctor.component';
import { FetchPatientComponent } from './components/fetchpatient/fetchpatient.component';
import { CreatePatient } from './components/addpatient/addpatient.component';
import { FetchScheduleComponent } from './components/fetchschedule/fetchschedule.component';
import { CreateSchedule } from './components/addschedule/addschedule.component';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        FetchUserComponent,
        CreateUser,
        FetchDoctorComponent,
        CreateDoctor,
        FetchPatientComponent,
        CreatePatient,
        FetchScheduleComponent,
        CreateSchedule
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'fetch-user', component: FetchUserComponent },
            { path: 'register-user', component: CreateUser },
            { path: 'user/edit/:id', component: CreateUser },
            { path: 'fetch-doctor', component: FetchDoctorComponent },
            { path: 'register-doctor', component: CreateDoctor },
            { path: 'doctor/edit/:id', component: CreateDoctor },
            { path: 'fetch-patient', component: FetchPatientComponent },
            { path: 'register-patient', component: CreatePatient },
            { path: 'patient/edit/:id', component: CreatePatient },
            { path: 'fetch-schedule', component: FetchScheduleComponent },
            { path: 'register-schedule', component: CreateSchedule },
            { path: 'schedule/edit/:id', component: CreateSchedule },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [UserService, DoctorService, PatientService, ScheduleService]
})
export class AppModuleShared {
}
