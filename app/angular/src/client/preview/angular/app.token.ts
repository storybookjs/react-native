import { InjectionToken } from '@angular/core';
import { StoryFnAngularReturnType } from '../types';

export const STORY = new InjectionToken<StoryFnAngularReturnType>('story');
