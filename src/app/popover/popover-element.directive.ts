import {Directive, ElementRef, HostBinding} from '@angular/core';
import {OverlayProperties} from './overlay/interfaces';
import {Overlay} from './overlay/overlay.service';
import {EventService as OverlayEventService} from './overlay/event.service';

@Directive({
    selector: 'popover',
    exportAs: 'popover'
})

export class PopoverElementDirective {
    get componentRef() {
        return this.overlay.componentRefs[0];
    }

    get isPopoverDestroyed() {
        return this.componentRef && this.componentRef.hostView.destroyed;
    }

    @HostBinding('style.display') hostDisplay: string;

    constructor(
    	private elementRef: ElementRef, 
    	public overlay: Overlay,
    	private overlayEventService: OverlayEventService) {
    	
        this.hostDisplay = 'none';
    }

    public close() {
        if (!this.componentRef || this.isPopoverDestroyed) {
            return;
        }

        this.overlayEventService.emitChangeEvent({
            type: 'Hide'
        });
    }
}