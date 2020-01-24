import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapComponent } from './map/map.component';
import { RegionDescriptionComponent } from './region-description/region-description.component';


const routes: Routes = [
  {path: 'map', component: MapComponent},
  {path: 'description/:name', component: RegionDescriptionComponent},
  {path: '**', redirectTo: 'map'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
