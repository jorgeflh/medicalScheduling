import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/users.service'

@Component({
    templateUrl: './fetchuser.component.html'
})

export class FetchUserComponent {
    public usersList: UserData[] = [];

    constructor(public http: Http, private _router: Router, private _userService: UserService) {
        this.getUsers();
    }

    getUsers() {
        this._userService.getUsers().subscribe(            
            data => this.usersList = data
        )
    }

    delete(id:number) {
        var ans = confirm("Você quer deletar o usuário de Id: " + id);
        if (ans) {
            this._userService.deleteUser(id).subscribe((data) => {
                this.getUsers();
            }, error => console.error(error))
        }
    }
}

interface UserData {
    id: number;
    name: string;
    userName: string;
    password: string;
}