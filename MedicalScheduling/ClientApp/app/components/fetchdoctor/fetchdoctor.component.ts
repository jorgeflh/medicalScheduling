import { Component, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../services/doctors.service'

@Component({
    templateUrl: './fetchdoctor.component.html'
})

export class FetchDoctorComponent {
    public doctorsList: DoctorData[] = [];
    public paging?: Paging;
    public link: Link[] = [];
    public pageNumber = 1;
    public pageSize = 5;
    public pages = [];
    public errorMessage = "";

    constructor(public http: Http, private _router: Router, private _doctorService: DoctorService) {
        this.getDoctors(this.pageNumber, this.pageSize);
    }

    getDoctors(pageNumber: number, pageSize: number) {
        this._doctorService.getDoctors(pageNumber, pageSize).subscribe(
            data => (this.paging = data.paging, this.link = data.links, this.doctorsList = data.items)
        )
    }

    delete(id:number) {
        var ans = confirm("Você quer deletar o médico de Id: " + id);
        if (ans) {
            this._doctorService.deleteDoctor(id).subscribe((data) => {
                this.getDoctors(this.pageNumber, this.pageSize);
            }, error => this.errorMessage = error._body)
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

interface DoctorData {
    id: number;
    name: string;
}