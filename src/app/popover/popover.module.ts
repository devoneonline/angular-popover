import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OverlayModule} from './overlay/overlay.module';
import {PopoverComponent} from './popover.component';
import {AdDirective} from './ad.directive';
import {Popover} from './popover.service';
import {PopoverProperties} from './interfaces';
import {PopoverElementDirective} from './popover-element.directive';
import {PopoverTriggerDirective} from './popover-trigger.directive';
import {PopoverPropertiesService} from './popover-properties.service';

@NgModule({
    declarations: [
        PopoverComponent,
        AdDirective,
        PopoverElementDirective,
        PopoverTriggerDirective
    ],
    imports: [
        CommonModule,
        OverlayModule
    ],
    exports: [
        PopoverElementDirective,
        PopoverTriggerDirective
    ],
    providers: [
        Popover
    ],
    bootstrap: [],
    entryComponents: [
        PopoverComponent
    ]
})
export class PopoverModule {
    static forRoot(initProperties: PopoverProperties): ModuleWithProviders<PopoverModule> {
        return {
            ngModule: PopoverModule,
            providers: [
                {
                    provide: PopoverPropertiesService,
                    useValue: initProperties
                }
            ]
        };
    }
}
