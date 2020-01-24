import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Regioni } from '../regioni';
import { RegionsService } from '../regions.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

export class MapComponent implements OnInit {
  private map;

  marker: Regioni[] = [];
  layer = []
  popupLayer;

  time: Date = new Date

  values: string = '';
  UpdatedRegionList: Regioni[] = []
  audio = new Audio('../assets/mp3/oraesatta.mp3');

  iCounterMap: number = 0
  mapStyle: string[] = [
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png",
    "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png",
    "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}.png",
    "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png",
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    "https://{s}.tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png"
  ]

  commonIconParams = {
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 31],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [30, 30]
  };

  orangeIcon = new L.Icon({
    ...this.commonIconParams,
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  });

  constructor(private _regionService: RegionsService, ) {
  }

  getRegionList() {
    this._regionService.getRegionsList().subscribe(
      (region: Regioni[]) => {
        this.marker = region
      }
    )
  }

  onKey(event) {
    this.values = event.target.value;
    this.UpdatedRegionList = []
    
    this.marker.forEach((regione: Regioni) => {
      if (regione.name.toLowerCase().startsWith(this.values.toLowerCase())) {
        if (!this.UpdatedRegionList.includes(regione)) {
          this.UpdatedRegionList.push(regione)
        }
      }
    })
    this.clearLayer()
    this.filterMap()
  }

  clearLayer() {
    this.layer.forEach((item: any) => {
      item.remove()
    })
    this.layer = []
  }

  filterMap() {
    this.UpdatedRegionList.forEach((region: Regioni) => {
      let popup = L.popup().setContent('<h1>' + region.name + '</h1><h3>' + region.lat + '<br>' + region.lng + '</h3>' +
        '<a class="link" href=description/' + region.name + '>' + 'Scopri di più' + '</a>');
      this.layer.push(L.marker([region.lat, region.lng],
        { icon: this.orangeIcon }).bindPopup(popup).on("click"));
    })
    this.layer.forEach((region: any) => {
      region.addTo(this.map)
    })
  }

  randomMapStyle() {
    var max = this.mapStyle.length
    this.iCounterMap = Math.floor(Math.random() * max);
    const tiles = L.tileLayer(this.mapStyle[this.iCounterMap])
    tiles.addTo(this.map)
  }

  changeMapStylePrevious() {
    if (this.iCounterMap == 0) {
      this.iCounterMap = this.mapStyle.length - 1
    } else this.iCounterMap -= 1
    const tiles = L.tileLayer(this.mapStyle[this.iCounterMap], {
      maxZoom: 19,
    });
    tiles.addTo(this.map)
  }

  changeMapStyleNext() {
    if (this.iCounterMap == this.mapStyle.length - 1) {
      this.iCounterMap = 0
    } else this.iCounterMap += 1
    const tiles = L.tileLayer(this.mapStyle[this.iCounterMap], {
      maxZoom: 19,
    });
    tiles.addTo(this.map)
  }

  changeMapNightStyle(){
    const nightStyle = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.jpg', {
      bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
      minZoom: 1,
      maxZoom: 8,
      format: 'jpg',
      time: '',
      tilematrixset: 'GoogleMapsCompatible_Level'
    });
    nightStyle.addTo(this.map)
  }

  openMap() {
    const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> TeamItaly',
    });
    this.marker.forEach((region: Regioni) => {
      let popup = L.popup().setContent('<h1>' + region.name + '</h1><h3>' + region.lat + '<br>' + region.lng + '</h3>' +
        '<a class="link" href=description/' + region.name + '>' + 'Scopri di più' + '</a>');
      this.layer.push(L.marker([region.lat, region.lng],
        { icon: this.orangeIcon }).bindPopup(popup).on("click"));
    })

    this.layer.forEach((region: any) => { //inizializza markers
      region.addTo(this.map)
    })
    tiles.addTo(this.map) //inizializza mappa
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [41.5439, 12.2854],
      zoom: 6,
    });
  }

  ngOnInit(): void {
    this.getRegionList()
    this.initMap();
    this.openMap();

    if(this.time.getHours() > 17){
      this.changeMapNightStyle()
    }
  }
}