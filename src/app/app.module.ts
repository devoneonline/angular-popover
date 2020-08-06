import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { PopoverModule, PopoverProperties } from './popover';
import { ChildComponent } from './child.component';

const MyDefaultPopoverProperties: PopoverProperties = {
    //showDelay: 2500
}

@NgModule({
  declarations: [
    AppComponent,
    ChildComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PopoverModule.forRoot(MyDefaultPopoverProperties as PopoverProperties)
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ChildComponent]
})
export class AppModule { }
