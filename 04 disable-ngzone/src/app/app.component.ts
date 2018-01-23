import {ApplicationRef, ChangeDetectionStrategy, ChangeDetectorRef, Component, DoCheck} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  //changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements DoCheck {
  counter: number = 0;

  constructor(private cdr: ChangeDetectorRef, private appRef: ApplicationRef) {
    // const org = cdr.detectChanges;
    // cdr.detectChanges = function() {
    //   console.log("AppComponent.detectChanges");
    //   return org.apply(this, arguments);
    // }
  }

  // ngDoCheck() {
  //   console.log("AppComponent.ngDoCheck");
  // }

  inc() {
    ++this.counter;

    this.cdr.markForCheck();

    //console.log(this.cdr["_view"].def.flags);

    // setTimeout(() => {
    //   if(this.cdr["_view"].state & 8) {
    //     //this.cdr.detectChanges();
    //
    //     this.appRef.tick();
    //   }
    // }, 0);
  }
}
