# Popover for Angular

Angular popover library. The Popover it is a pop-up box that appears when the user clicks on an element.

## Demo
http://ivylab.space/popover

## Installation

Install the npm package.

    npm i @ivylab/angular-popover
        
Import `NgModule`:

```ts
import { PopoverModule } from '@ivylab/angular-popover';
 
@NgModule({
    imports: [PopoverModule]
}) 
```

## Usage
    
Use the popover tag for your content:

```html
<popover #myPopover>
    A popover is a light roll made from an egg batter similar to that of Yorkshire pudding.
</popover>

<button [popoverTriggerFor]="myPopover">Show</button>
```

Or pass your component to the popover:

```ts
import {Popover} from './popover';
import {MyComponent} from './my-component';

export class AppComponent {
    constructor(public popover: Popover) { }
    
    showPopover(event){
        this.popover.load({
            event,
            component: MyComponent
        });
    }
}
```

Specify an `$event` as an argument to pass element information to the popover:

```html
<button (click)="showPopover($event)">Show</button>
```

Also pass your component to `entryComponents` when importing into module:

```ts
import {MyComponent} from './my-component';

@NgModule({
    declarations: [MyComponent],
    entryComponents: [MyComponent]
})
```

## Properties

| name             | type                                | default | description                                 |
|------------------|-------------------------------------|---------|---------------------------------------------|
| placement        | "top", "bottom", "left", "right"    | "bottom"| The position of the popover.                |
| showDelay        | number                              | 300     | The delay in ms before showing the popover. |
| hideDelay        | number                              | 100     | The delay in ms before removing the popover.|
| width            | string                              |         | Popover Width, for example "300px" or "30%".|
| height           | string                              |         | Popover Height.                             |
| maxWidth         | string                              |         | Minimum popover width, for example "300px" or "30%".|
| theme            | "dark", "light"                     | "light" | Theme of popover background and text.       |
| zIndex           | number                              | "bottom"| Popover z-index.                            |
| offset           | number                              | 8       | Indent between the arrow of the popover and the element (in pixels).|
| animation        | "fade", "upwards"                   |         | Animation of showing and hiding popover.    |
| animationDuration| number                              | 100     | The duration of the popover open/close animation.|
| animationTimingFunction | "ease", "ease-in", "ease-out", "ease-in-out" | "ease-in-out" | Specifies the speed curve of an animation. |
| popoverClass     | string, string[]                    |         | Custom classes for popover.                 |
| padding          | string                              | "16px"  | Padding for popover content.                |
| noArrow          | boolean                             | "bottom"| Hide arrow popover.                         |
| whiteSpace       | "nowrap", "normal"                  | "normal"| Controls how whitespace is handled within a popover. |
| shadow           | boolean                             | true    | Shadow of the popover.                      |
| fontSize         | string                              |         | The size of the text inside the popover.    |
| pointerEvents    | "auto", "none"                      | "none"  | Defines whether or not an element reacts to pointer events. |
| display          | boolean                             | true    | Popover availability for display.           |


## Set default values

Pass your parameters when importing the module:
    
And pass your parameters when importing the module:
```ts
import {PopoverModule, PopoverProperties} from './popover';
const MyDefaultPopoverProperties: PopoverProperties = {
    theme: 'dark'
}
 
@NgModule({
    imports: [ 
        PopoverModule.forRoot(MyDefaultPopoverProperties as PopoverProperties)
    ]
})
```

## Methods

| Method           | Description                                                                                 |
|------------------|---------------------------------------------------------------------------------------------|
| load(properties: PopoverProperties) | Show popover                                                             |
| close()          | Hide popover                                                                                |

## Events

When you call events, the delays that are specified in the options in the directive are taken into account. Default delay before tooltip hiding is 300 milliseconds.

| Event            | Description                                                                                 |
|------------------|---------------------------------------------------------------------------------------------|
| {type: "show"} | The event is called before the popover appears. |
| {type: "shown"} | The event is called after the animation of the appearance of the popover. |
| {type: "hide"} | The event is called before the popover is hidden. |
| {type: "hidden"} | The event is called after the animation of the popover is hidden. |