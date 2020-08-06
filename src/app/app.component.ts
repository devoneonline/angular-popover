import { Component, ViewChild } from '@angular/core';

import {Popover, PopoverProperties, PopoverEventService} from './popover';
import {ChildComponent} from './child.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

    @ViewChild('hitBox', {static: false}) hitBox;

    constructor(
        public popover: Popover,
        public popoverEventService: PopoverEventService) {

    }

    ngOnInit() {

    }

    handleEvents(event) {
        console.log("event", event);
    }
}
