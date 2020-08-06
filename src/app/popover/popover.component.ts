import {Component, ElementRef, EventEmitter, Input, ComponentFactoryResolver, ViewChild, HostBinding, HostListener, Renderer2} from '@angular/core';
import {Overlay} from './overlay/overlay.service';
import {ComponentProperties, OverlayProperties} from './overlay/interfaces';
import {EventService as OverlayEventService} from './overlay/event.service';
import {AdDirective} from './ad.directive';

@Component({
    selector: 'popover-container',
    templateUrl: './popover.component.html',
    styleUrls: ['./popover.component.sass']
})
export class PopoverComponent {
    popoverPosition = {
        left: '',
        top: ''
    };
    _properties: OverlayProperties;
    minTimeout: number = 0;

    @HostBinding('style.top') hostTop: string;
    @HostBinding('style.left') hostLeft: string;
    @HostBinding('style.padding')
    get hostPadding() {
        return this.properties.metadata.padding;
    }
    @HostBinding('style.white-space')
    get hostWhiteSpace() {
        return this.properties.metadata.whiteSpace;
    }
    @HostBinding('style.border-radius')
    get hostBorderRadius() {
        return this.properties.metadata.borderRadius;
    }
    @HostBinding('style.box-shadow')
    get hostBoxShadow() {
        return this.properties.metadata.shadow ? this.properties.metadata.shadow : 'none';
    }
    @HostBinding('style.pointer-events')
    get hostPointerEvents() {
        return this.properties.metadata.pointerEvents;
    }
    @HostBinding('style.font-size')
    get hostFontSize() {
        return this.properties.metadata.fontSize;
    }
    @HostBinding('class.popover-light') hostLight: boolean;
    @HostBinding('class.popover-noarrow')
    get hostNoArrow() {
        return this.properties.metadata.noArrow;
    }

    @ViewChild(AdDirective, {static: true}) adHost: AdDirective;

    @Input() set overlayProperties(properties: OverlayProperties) {
        this._properties = properties;
    }

    get properties() {
        return this._properties;
    }

    get component() {
        return this.properties.childComponent;
    }

    get element() {
        return this.properties.metadata.element;
    }

    get popoverText() {
        return this.properties.metadata.popoverText;
    }

    get srcElement() {
        if (this.properties.metadata.event) {
            return this.properties.metadata.event.srcElement;
        }
    }

    get targetElement() {
        return this.properties.metadata.targetElement;
    }

    get placement() {
        return this.properties.metadata.placement;
    }

    get isAlignToCenter() {
        return this.properties.metadata.alignToCenter;
    }

    get isThemeLight() {
        return this.properties.metadata['theme'] === 'light';
    }

    get isArrow() {
        return this.isThemeLight && !this.hostNoArrow;
    }

    get isPopoverDestroyed() {
        return this.overlay.componentRefs[0] && this.overlay.componentRefs[0].hostView.destroyed;
    }

    get componentRef() {
        return this.overlay.componentRefs[0];
    }

    get autoPlacement() {
        return this.properties.metadata.autoPlacement;
    }

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private renderer: Renderer2,
        private elementRef: ElementRef,
        public overlay: Overlay,
        private overlayEventService: OverlayEventService) {

    }

    ngOnInit() {
        setTimeout(() => {
            if (this.component) {
                this.loadComponent();
            } else if (this.element) {
                this.appendElement();
            } else if (this.popoverText) {
                this.appendText();
            }

            this.setThemeClass();
            this.setPosition(this.placement);
        }, this.minTimeout);
    }

    loadComponent() {
        let adItem = this.properties;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.childComponent);
        let viewContainerRef = this.adHost.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
    }

    appendElement() {
        this.element.style.display = '';
        document.getElementsByTagName('popover-container')[0].appendChild(this.element);
    }

    appendText() {
        document.getElementsByTagName('popover-container')[0].innerHTML += this.popoverText;
    }

    setPlacementClass(placement: string) {
        this.renderer.addClass(this.elementRef.nativeElement, 'popover-' + placement);
    }

    setThemeClass(): void {
        this.hostLight = this.isThemeLight;
    }

    getPositionProperty() {
        const element = this.srcElement || this.targetElement;

        if (this.properties.metadata.position) {
            return this.properties.metadata.position;
        }

        if (element) {
            return element.getBoundingClientRect();
        } else {
            return {
                left: this.properties.metadata.left,
                top: this.properties.metadata.top
            }
        }
    }

    setPosition(placement) {
        const arrowHeight = 8;
        const element = this.properties.metadata.position ? false : this.srcElement || this.targetElement;
        const elementPosition = this.getPositionProperty();
        const elementHeight = element ? element.offsetHeight : 0;
        const elementWidth = element ? element.offsetWidth: 0;
        const popoverHeight = this.elementRef.nativeElement.clientHeight;
        const popoverWidth = this.elementRef.nativeElement.clientWidth;
        const scrollY = window.pageYOffset;
        const offset = this.properties.metadata.offset + arrowHeight;
        const arrowOffset = 16;
        const arrowWidth = 16;
        const offsetArrowCenter = arrowOffset + arrowWidth / 2;
        let hostTop;
        let hostLeft;

        // Top - bottom
        if (placement === 'top') {
            hostTop = (elementPosition.top + scrollY) - (popoverHeight + offset);
        }

        if (placement === 'bottom') {
            hostTop = (elementPosition.top + scrollY) + elementHeight + offset;
        }

        if (placement === 'top' || placement === 'bottom') {
            hostLeft = (elementPosition.left + elementWidth / 2) - popoverWidth / 2;
        }

        // Left - right
        if (placement === 'left') {
            hostLeft = elementPosition.left - popoverWidth - offset;
        }

        if (placement === 'right') {
            hostLeft = elementPosition.left + elementWidth + offset;
        }

        if (placement === 'left' || placement === 'right') {
            hostTop = (elementPosition.top + scrollY) + elementHeight / 2 - popoverHeight / 2;
        }

        this.hostTop = hostTop + 'px';
        this.hostLeft = hostLeft + 'px';
        this.setPlacementClass(placement);
    }

    checkPosition(properties: {
        top: number, 
        left: number, 
        width: number, 
        height: number
    }) {
        const scrollY = window.pageYOffset;

        const topEdge = properties.top - scrollY;
        const bottomEdge = properties.top + properties.height;
        const leftEdge = properties.left;
        const rightEdge = properties.left + properties.width;
        const bodyHeight = window.innerHeight + scrollY;
        const bodyWidth = document.body.clientWidth;

        if (topEdge < 0 || bottomEdge > bodyHeight || leftEdge < 0 || rightEdge > bodyWidth) {
            return false;
        } else {
            return true;
        }
    }
}
