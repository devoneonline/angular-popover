import { InjectionToken } from '@angular/core';
import { PopoverProperties } from './interfaces';

/**
 * This is not a real service, but it looks like it from the outside.
 * It's just an InjectionToken used to import the config (initOptions) object, provided from the outside
 */
export const PopoverPropertiesService = new InjectionToken<PopoverProperties>('PopoverProperties');
