import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { Location } from '../../models/location';

@Injectable()
export class LocationsService {
    private data: Response;

    constructor(private http: Http) { }

    getLocations(): Observable<any[]> {
        return this.http.get('http://climbontheway.com/api/data.php/')
            .subscribe(res => this.data = res.json());
    }
}
