import 'jest-preset-angular/setupJest';
import AngularSnapshotSerializer from 'jest-preset-angular/AngularSnapshotSerializer';
import HTMLCommentSerializer from 'jest-preset-angular/HTMLCommentSerializer';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { addSerializer } from 'jest-specific-snapshot';
import { initModuleData } from './helpers.ts';

addSerializer(HTMLCommentSerializer);
addSerializer(AngularSnapshotSerializer);

function getRenderedTree(story, context) {
  const curentStory = story.render(context);

  const { moduleMeta, AnnotatedComponent } = initModuleData(curentStory);

  TestBed.configureTestingModule({
    imports: [...moduleMeta.imports],
    declarations: [...moduleMeta.declarations],
    providers: [...moduleMeta.providers],
    schemas: [NO_ERRORS_SCHEMA, ...moduleMeta.schemas],
    entryComponents: [...moduleMeta.entryComponents],
    bootstrap: [...moduleMeta.bootstrap],
  });

  // this is async. Should be somehow called in beforeEach
  TestBed.compileComponents();

  const tree = TestBed.createComponent(AnnotatedComponent);
  tree.detectChanges();

  return tree;
}

export default getRenderedTree;
