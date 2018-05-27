import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/users.service'

@Component({
    templateUrl: './fetchuser.component.html'
})

export class FetchUserComponent {
    public usersList: UserData[] = [];
    public paging?: Paging;
    public link: Link[] = [];
    public pageNumber = 1;
    public pageSize = 5;
    public pages = [];

    constructor(public http: Http, private _router: Router, private _userService: UserService) {
        this.getUsers(this.pageNumber, this.pageSize);
    }
    
    getUsers(pageNumber: number, pageSize: number) {
        this._userService.getUsers(pageNumber, pageSize).subscribe(
            data => (this.paging = data.paging, this.link = data.links, this.usersList = data.items),
            error => console.error(error)
        );
    }

    delete(id:number) {
        var ans = confirm("Você quer deletar o usuário de Id: " + id);
        if (ans) {
            this._userService.deleteUser(id).subscribe((data) => {
                this.getUsers(this.pageNumber, this.pageSize);
            }, error => console.error(error))
        }
    }
}

interface Paging {
    totalItems: number,
    pageNumber: number,
    pageSize: number,
    totalPages: number
}

interface Link {
    href: string,
    rel: string,
    method: string
}

interface UserData {
    id: number;
    name: string;
    userName: string;
    password: string;
}