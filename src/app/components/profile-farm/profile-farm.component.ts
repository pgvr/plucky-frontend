import { Component, OnInit, Input } from "@angular/core";
import { AuthService } from "src/app/services/auth.service";
import { User } from "src/app/models/user.model";
import { FarmTag, Farm } from "src/app/models/farm.model";
import { ApiService } from "src/app/services/api.service";
import { Observable } from "rxjs";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { MatChipInputEvent } from "@angular/material/chips";

@Component({
  selector: "app-profile-farm",
  templateUrl: "./profile-farm.component.html",
  styleUrls: ["./profile-farm.component.scss"]
})
export class ProfileFarmComponent implements OnInit {
  faCamera = faCamera;
  faTimes = faTimes;
  @Input() editState: boolean;
  @Input() farm: Farm;
  @Input() owner: User;
  @Input() showContact: boolean;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  farmTags$: Observable<FarmTag[]>;
  allTags$: Observable<FarmTag[]>;
  constructor(private auth: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    console.log(this.farm);
    this.farmTags$ = this.api.getFarmTags(this.farm.farmTags);
    this.allTags$ = this.api.getAllTags();
  }

  async onImageChanged(event) {
    try {
      const file = event.target.files[0];
      const url = await this.api.uploadImage(file);
      this.farm.image = url;
    } catch (error) {
      console.log(error);
    }
  }

  async onImageChangedOwner(event) {
    try {
      const file = event.target.files[0];
      const url = await this.api.uploadImage(file);
      this.owner.photoUrl = url;
    } catch (error) {
      console.log(error);
    }
  }

  removeTag(tag: string) {
    const index = this.farm.productTags.indexOf(tag);
    if (index > -1) {
      this.farm.productTags.splice(index, 1);
    }
  }

  addToken(event: MatChipInputEvent) {
    const input = event.input;
    const value = event.value;
    if (value.trim()) {
      this.farm.productTags.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  modifyFarmTag(id) {
    const index = this.farm.farmTags.indexOf(id);
    if (index > -1) {
      this.farm.farmTags.splice(index, 1);
    } else {
      this.farm.farmTags.push(id);
    }
    this.farmTags$ = this.api.getFarmTags(this.farm.farmTags);
  }
}
