import {Directive, Input, Output, ElementRef, HostBinding, HostListener, EventEmitter} from '@angular/core';
import {OverlayProperties} from './overlay/interfaces';
import {PopoverProperties} from './interfaces';
import {defaultProperties} from './default-properties';
import {Popover as PopoverService} from './popover.service';
import {Overlay} from './overlay/overlay.service';
import {EventService as OverlayEventService} from './overlay/event.service';

@Directive({
    selector: '[popoverTriggerFor], [popover]'
})

export class PopoverTriggerDirective {
    hideTimeoutId: number;
    destroyTimeoutId: number;
    createTimeoutId: number;
    showTimeoutId: number;
    globalEventsSubscription;

    get componentRef() {
        return this.overlay.componentRefs[0];
    }

    get isPopoverDestroyed() {
        return this.componentRef && this.componentRef.hostView.destroyed;
    }

    @Input() popoverTriggerFor;
    @Input() popover;
    
    @Input() popoverClass: PopoverProperties['popoverClass'];
    @Input() hideDelay: PopoverProperties['hideDelay'];
    @Input() showDelay: PopoverProperties['showDelay'];
    @Input() pointerEvents: PopoverProperties['pointerEvents'];
    @Input() display: PopoverProperties['display'] = true;
    
    // Animation
    @Input() animation: PopoverProperties['animation'];
    @Input() animationDuration: PopoverProperties['animationDuration'];
    @Input() animationTimingFunction: PopoverProperties['animationTimingFunction'];
    @Input() animationTranslateY: PopoverProperties['animationTranslateY'];

    // Position 
    @Input() placement: PopoverProperties['placement'];
    @Input() zIndex: PopoverProperties['zIndex'];

    // Sizes
    @Input() width: PopoverProperties['width'];
    @Input() height: PopoverProperties['height'];
    @Input() maxWidth: PopoverProperties['maxWidth'];
    @Input() minWidth: PopoverProperties['minWidth'];
    @Input() whiteSpace: PopoverProperties['whiteSpace'];

    // Styles
    @Input() theme: PopoverProperties['theme'];
    @Input() offset: PopoverProperties['offset'];
    @Input() padding: PopoverProperties['padding'];
    @Input() noArrow: PopoverProperties['noArrow'];
    @Input() borderRadius: PopoverProperties['borderRadius'];
    @Input() shadow: PopoverProperties['shadow'];
    @Input() fontSize: PopoverProperties['fontSize'];


    @Output() events: EventEmitter < any > = new EventEmitter < any > ();
    

    @HostListener('click', ['$event'])
    onClick(event) {
        if (!this.display) {
            return;
        }

        this.load(event);
    }

    constructor(
        private elementRef: ElementRef,
        public popoverService: PopoverService, 
        public overlay: Overlay,
        private overlayEventService: OverlayEventService) {

        this.globalEventsSubscription = this.overlayEventService.emitter.subscribe(
            (event) => {
                this.handleGlobalEvents(event);
            }
        );
    }

    ngOnDestroy() {
        this.popoverService.close();
    }

    load(event) {
        this.popoverService.load({
            event,
            element: this.getPopoverElement(),
            popoverText: this.popover,
            width: this.width,
            height: this.height,
            maxWidth: this.maxWidth,
            minWidth: this.minWidth,
            placement: this.placement,
            popoverClass: this.popoverClass,
            theme: this.theme,
            offset: this.offset,
            animationDuration: this.animationDuration,
            animationTimingFunction: this.animationTimingFunction,
            animationTranslateY: this.animationTranslateY,
            padding: this.padding,
            zIndex: this.zIndex,
            noArrow: this.noArrow,
            hideDelay: this.hideDelay,
            showDelay: this.showDelay,
            whiteSpace: this.whiteSpace,
            borderRadius: this.borderRadius,
            animation: this.animation,
            shadow: this.shadow,
            pointerEvents: this.pointerEvents,
            fontSize: this.fontSize
        });
    }

    getPopoverElement() {
        if (typeof this.popover === 'string') {
            return undefined;
        }

        let element = this.popoverTriggerFor;

        if (this.popoverTriggerFor.elementRef) {
            element = this.popoverTriggerFor.elementRef.nativeElement;
        }

        return element;
    }

    handleGlobalEvents(event) {
        if (event.type === "Show" ||
            event.type === "Shown" ||
            event.type === "Hide" ||
            event.type === "Hidden") {

            this.events.emit(event);
        }
    }
}