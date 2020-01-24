import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Regioni } from './regioni';
import { COORDS } from './coord-mock';

@Injectable({
  providedIn: 'root'
})
export class RegionsService {

  constructor() { }

  getRegionsList(): Observable<Regioni[]> {
    return of(COORDS)
  }

  getRegion(name: string): Observable<Regioni> {
    return of(COORDS.find(selectedRegion => selectedRegion.name === name))
  }
}
