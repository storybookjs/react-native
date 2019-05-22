/* eslint-disable import/no-extraneous-dependencies */
import { InjectionToken } from '@angular/core';
import { NgStory } from './types';

export const STORY = new InjectionToken<NgStory>('story');
