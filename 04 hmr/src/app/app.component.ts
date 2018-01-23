import { Component } from '@angular/core';
import {appStore} from './app.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor() {
    console.log("AppComponent.ctor");
  }

  get counter() {
    return appStore.counter;
  }

  inc() {
    ++appStore.counter;
  }

  dec() {
    --appStore.counter;
  }
}
