import { Component, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { FetchUserComponent } from '../fetchusers/fetchuser.component';
import { UserService } from '../../services/users.service';

@Component({
    templateUrl: './adduser.component.html'
})

export class CreateUser implements OnInit {
    userForm: FormGroup;
    title: string = "Create";
    id: number = 0;
    errorMessage: any;

    constructor(private _fb: FormBuilder, private _avRoute: ActivatedRoute,
        private _userService: UserService, private _router: Router) {
        if (this._avRoute.snapshot.params["id"]) {
            this.id = this._avRoute.snapshot.params["id"];
        }

        this.userForm = this._fb.group({
            id: 0,
            name: ['', [Validators.required]],
            userName: ['', [Validators.required]],
            password: ['', [Validators.required]]
        })
    }

    ngOnInit() {
        
        if (this.id > 0) {
            this.title = "Edit";
            this._userService.getUserById(this.id)
                .subscribe(resp => this.userForm.setValue(resp)
                    , error => this.errorMessage = error);
        }
    }

    save() {
        if (!this.userForm.valid) {
            return;
        }

        if (this.title == "Create") {
            this._userService.saveUser(this.userForm.value)
                .subscribe((data) => {
                    this._router.navigate(['/fetch-user']);
                }, error => this.errorMessage = error)
        }
        else if (this.title == "Edit") {
            console.log("id = " + this.userForm.controls['id'].value);
            this._userService.updateUser(this.userForm.controls['id'].value, this.userForm.value)
                .subscribe((data) => {
                    this._router.navigate(['/fetch-user']);
                }, error => this.errorMessage = error)
        }
    }

    cancel() {
        this._router.navigate(['/fetch-user']);
    }

    get name() { return this.userForm.get('name')!.value; }
    get userName() { return this.userForm.get('userName')!.value; }
    get password() { return this.userForm.get('password')!.value; }
}