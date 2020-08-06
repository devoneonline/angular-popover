import {Injectable, Injector, ComponentFactoryResolver, EmbeddedViewRef, ApplicationRef, ComponentRef, EventEmitter, Optional, Inject} from '@angular/core';

import {PopoverComponent} from './popover.component';
import {EventService as OverlayEventService} from './overlay/event.service';
import {ComponentProperties, OverlayProperties} from './overlay/interfaces';
import {Overlay} from './overlay/overlay.service';
import {PopoverPropertiesService} from './popover-properties.service';

import {PopoverProperties} from './interfaces';
import {defaultProperties} from './default-properties';

@Injectable()
export class Popover {
    _defaultProperties: OverlayProperties;
    properties: PopoverProperties;
    hideTimeoutId: number;
    destroyTimeoutId: number;
    createTimeoutId: number;
    showTimeoutId: number;
    globalEventsSubscription;
    savedEvent: any;

    get componentRef() {
        return this.overlay.componentRefs[0];
    }

    get isPopoverDestroyed() {
        return this.componentRef && this.componentRef.hostView.destroyed;
    }

    get destroyDelay() {
        if (this.properties) {
            return this.properties.hideDelay + this.properties.animationDuration;
        } else {
            return 0;
        }
    }

    get showDelay() {
        if (this.properties) {
            return this.properties.trigger === "click" ? 0 : this.properties.showDelay;
        } else {
            return 0;
        }
    }

    constructor(
        public overlay: Overlay,
        private overlayEventService: OverlayEventService,
        @Optional() @Inject(PopoverPropertiesService) private initProperties) {

        this.globalEventsSubscription = this.overlayEventService.emitter.subscribe(
            (event) => {
                this.handleGlobalEvents(event);
            }
        );
    }

    public load(properties: PopoverProperties) {
        this.properties = this.applyPropertieDefaults(defaultProperties, properties);
        this.savedEvent = properties.event;

        this.showTimeoutId = window.setTimeout(() => {
            this.overlay.load({
                id: 'popover',
                mainComponent: PopoverComponent,
                childComponent: this.properties.component,
                width: this.properties.width,
                height: this.properties.height,
                maxWidth: this.properties.maxWidth,
                minWidth: this.properties.minWidth,
                animationDuration: this.properties.animationDuration,
                animationTimingFunction: this.properties.animationTimingFunction,
                animationTranslateY: this.getAnimationTranslateY(),
                zIndex: this.properties.zIndex,
                metadata: {
                    placement: this.properties.placement,
                    alignToCenter: this.properties.alignToCenter,
                    event: properties.event,
                    element: this.properties.element,
                    popoverText: this.properties.popoverText,
                    targetElement: this.properties.targetElement,
                    offset: this.properties.offset,
                    theme: this.properties.theme,
                    popoverClass: this.properties.popoverClass,
                    padding: this.properties.padding,
                    noArrow: this.properties.noArrow,
                    left: this.properties.left,
                    top: this.properties.top,
                    whiteSpace: this.properties.whiteSpace,
                    borderRadius: this.properties.borderRadius,
                    shadow: this.properties.shadow,
                    pointerEvents: this.properties.pointerEvents,
                    fontSize: this.properties.fontSize
                },
            });
        }, this.showDelay);
    }

    getAnimationTranslateY() {
        return this.properties.animation === "fade" ? "0px" : this.properties.animationTranslateY;
    }

    public close() {
        if (!this.componentRef || this.isPopoverDestroyed) {
            return;
        }

        this.overlayEventService.emitChangeEvent({
            type: 'Hide'
        });
    }

    public fastClose() {
        this.overlayEventService.emitChangeEvent({
            type: '[Overlay] Hide'
        });
    }

    applyPropertieDefaults(defaultProperties, properties) {
        if (!properties) {
            properties = {};
        }

        for (var propertie in properties) {
            if (properties[propertie] === undefined) {
                delete properties[propertie];
            }
        }

        this._defaultProperties = Object.assign({}, defaultProperties, this.initProperties || {});
        return Object.assign(this._defaultProperties, properties);
    }

    destroyPopover(options = {
        fast: false
    }): void {
        this.clearTimeouts();

        if (this.isPopoverDestroyed == false) {
            this.hideTimeoutId = window.setTimeout(() => {
                this.close();
            }, options.fast ? 0 : this.properties.hideDelay);

            this.destroyTimeoutId = window.setTimeout(() => {
                if (!this.componentRef || this.isPopoverDestroyed) {
                    return;
                }

                this.fastClose();
            }, options.fast ? 0 : this.destroyDelay);
        }
    }

    checkEventForUniqueness(event) {
        if (this.savedEvent && event) {
            return this.savedEvent['srcElement'] != event['srcElement'];
        }
    }

    clearTimeouts(event: any = undefined) {
        if (this.checkEventForUniqueness(event)) {
            return;
        }

        if (this.createTimeoutId) {
            clearTimeout(this.createTimeoutId);
        }

        if (this.showTimeoutId) {
            clearTimeout(this.showTimeoutId);
        }

        if (this.hideTimeoutId) {
            clearTimeout(this.hideTimeoutId);
        }

        if (this.destroyTimeoutId) {
            clearTimeout(this.destroyTimeoutId);
        }
    }

    handleGlobalEvents(event) {
        if (event.type === 'Focusin'){
            this.clearTimeouts();
        }
        if (event.type === 'Focusout' && this.properties.trigger === "hover"){
            this.destroyPopover();
        }
    }
}