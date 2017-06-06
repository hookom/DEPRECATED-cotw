import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Location } from '../../models/location';

@Injectable()
export class LocationsService {
    private dataUrl = 'http://www.climbontheway.com/api/get.php';

    constructor(private http: Http) { }

    getLocations(): Observable<Location[]> {
        return this.http.get(this.dataUrl)
                    .map((res:Response) => res.json())
                    .catch(this.handleError);
    }

    private handleError (error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
  }
}
