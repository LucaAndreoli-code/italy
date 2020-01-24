import { Component, OnInit } from '@angular/core';
import { Regioni } from '../regioni';
import { ActivatedRoute } from '@angular/router';
import { RegionsService } from '../regions.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-region-description',
  templateUrl: './region-description.component.html',
  styleUrls: ['./region-description.component.css']
})

export class RegionDescriptionComponent implements OnInit {

  regione: Regioni;
  regionsList: Regioni[] = []
  name: string;

  constructor(private _route: ActivatedRoute,
    private _regionService: RegionsService,
    private _location: Location) { }

  goHome() {
    this._location.go("/map/")
    window.location.reload();
  }

  changeSelectedRegion(selectedRegion:string){
    this._location.go("/description/" + selectedRegion)
    window.location.reload();
  }

  getRegionsList(){
    this._regionService.getRegionsList().subscribe(
      (region: Regioni[]) =>{
        this.regionsList = region
      }
    )
  }

  getRegion(){
    this.name = this._route.snapshot.paramMap.get('name')
    this._regionService.getRegion(this.name).subscribe(
      (regionDetail: Regioni) => {
        this.regione = regionDetail
      }
    )
  }

  ngOnInit() {
    this.getRegion()
    this.getRegionsList()
  }
}
