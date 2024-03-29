import { Component, OnInit } from "@angular/core";
import { ApiService } from "src/app/services/api.service";
import { Observable } from "rxjs";
import { Farm } from "src/app/models/farm.model";
import * as firebase from "firebase";
import { Router } from "@angular/router";

@Component({
  selector: "app-employee-home",
  templateUrl: "./employee-home.component.html",
  styleUrls: ["./employee-home.component.scss"]
})
export class EmployeeHomeComponent implements OnInit {
  farm$: Observable<Farm[]>;
  constructor(public api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.farm$ = this.api.getFarms();
  }

  goToDetail(farm: Farm) {
    this.router.navigateByUrl(`/farm-detail/${farm.id}`);
  }
}
