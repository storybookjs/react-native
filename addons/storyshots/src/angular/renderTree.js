/* eslint-disable import/no-extraneous-dependencies */
import AngularSnapshotSerializer from 'jest-preset-angular/AngularSnapshotSerializer';
import HTMLCommentSerializer from 'jest-preset-angular/HTMLCommentSerializer';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { addSerializer } from 'jest-specific-snapshot';
import { initModuleData } from './helpers.ts';

addSerializer(HTMLCommentSerializer);
addSerializer(AngularSnapshotSerializer);

function getRenderedTree(story, context) {
  const currentStory = story.render(context);

  const { moduleMeta, AppComponent } = initModuleData(currentStory);

  TestBed.configureTestingModule({
    imports: [...moduleMeta.imports],
    declarations: [...moduleMeta.declarations],
    providers: [...moduleMeta.providers],
    schemas: [NO_ERRORS_SCHEMA, ...moduleMeta.schemas],
    bootstrap: [...moduleMeta.bootstrap],
  });

  TestBed.overrideModule(BrowserDynamicTestingModule, {
    set: {
      entryComponents: [...moduleMeta.entryComponents],
    },
  });

  return TestBed.compileComponents().then(() => {
    const tree = TestBed.createComponent(AppComponent);
    tree.detectChanges();

    return tree;
  });
}

export default getRenderedTree;
