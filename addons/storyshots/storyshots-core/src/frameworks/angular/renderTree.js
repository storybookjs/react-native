// eslint-disable-next-line import/no-extraneous-dependencies
import AngularSnapshotSerializer from 'jest-preset-angular/AngularSnapshotSerializer';
// eslint-disable-next-line import/no-extraneous-dependencies
import HTMLCommentSerializer from 'jest-preset-angular/HTMLCommentSerializer';
// eslint-disable-next-line import/no-extraneous-dependencies
import { TestBed } from '@angular/core/testing';
// eslint-disable-next-line import/no-extraneous-dependencies
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { addSerializer } from 'jest-specific-snapshot';
import { initModuleData } from './helpers';

addSerializer(HTMLCommentSerializer);
addSerializer(AngularSnapshotSerializer);

function getRenderedTree(story) {
  const currentStory = story.render();

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
