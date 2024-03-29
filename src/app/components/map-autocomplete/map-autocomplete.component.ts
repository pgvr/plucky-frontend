import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  NgModule,
  ElementRef,
  ViewChild,
  NgZone
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { AgmCoreModule, MapsAPILoader } from "@agm/core";
// @ts-ignore
import {} from "googlemaps";
import { Farm } from "src/app/models/farm.model";
import * as firebase from "firebase";

@Component({
  selector: "app-map-autocomplete",
  templateUrl: "./map-autocomplete.component.html",
  styleUrls: ["./map-autocomplete.component.scss"]
})
export class MapAutocompleteComponent implements OnInit {
  @Input() farm: Farm;

  public lat: number;
  public lng: number;
  public searchControl: FormControl;
  public zoom: number;

  @ViewChild("search")
  public searchElementRef: ElementRef;

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone) {}

  ngOnInit(): void {
    //set google maps defaults
    this.zoom = 13;

    if (this.farm) {
      console.log("got farm as input");
      // fallback if a new farm has no location yet, defaults to Lampertheim
      this.lat = this.farm.location?.latitude || 49.594879;
      this.lng = this.farm.location?.longitude || 8.46876;
    } else {
      this.lat = 48.7791242;
      this.lng = 9.0371322;
    }

    //create search FormControl
    this.searchControl = new FormControl();

    //set current position
    this.setCurrentPosition();

    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ["address"]
        }
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          } else {
            //set latitude, longitude and zoom
            this.lat = place.geometry.location.lat();
            this.lng = place.geometry.location.lng();
            this.zoom = 15;

            this.updateFarm(this.lat, this.lng);
          }
        });
      });
    });
  }

  async setPlace() {
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement,
      {
        types: ["address"]
      }
    );
    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    if (place.geometry === undefined || place.geometry === null) {
      return;
    }

    // TODO - Set place to farm
    this.updateFarm(
      place.geometry.location.lat(),
      place.geometry.location.lng()
    );
  }

  updateFarm(lat, lng) {
    let location = new firebase.firestore.GeoPoint(lat, lng);

    this.farm.location = location;
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
        this.updateFarm(this.lat, this.lng);
      });
    }
  }
}
