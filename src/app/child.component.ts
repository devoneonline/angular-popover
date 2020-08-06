import {Component, EventEmitter} from '@angular/core';
import {Popover} from './popover';

@Component({
    selector: 'child-component',
    templateUrl: './child.component.html',
})
export class ChildComponent {
	constructor(public popover: Popover) { }

    close() {
        this.popover.close();
    }
}