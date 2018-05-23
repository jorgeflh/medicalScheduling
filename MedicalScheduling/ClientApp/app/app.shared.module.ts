import { NgModule } from '@angular/core';
import { UserService } from './services/users.service'
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
import { PatientsComponent } from './components/patients/patients.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { DoctorService } from './services/doctors.service';

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        FetchUserComponent,
        CreateUser,
        FetchDoctorComponent,
        CreateDoctor,
        PatientsComponent,
        SchedulesComponent,
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
            { path: 'patients', component: PatientsComponent },
            { path: 'schedules', component: SchedulesComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ],
    providers: [UserService, DoctorService]
})
export class AppModuleShared {
}
