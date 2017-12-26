import 'jest-preset-angular/setupJest';
import AngularSnapshotSerializer from 'jest-preset-angular/AngularSnapshotSerializer';
import HTMLCommentSerializer from 'jest-preset-angular/HTMLCommentSerializer';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { addSerializer } from 'jest-specific-snapshot';
import { createAnnotatedComponent } from './helpers';

addSerializer(HTMLCommentSerializer);
addSerializer(AngularSnapshotSerializer);

function getRenderedTree(story, context) {
  const storyElement = story.render(context);

  const {
    // props,
    // component,
    moduleMetadata = { imports: [], schemas: [], declarations: [], providers: [] },
  } = storyElement;

  const moduleMeta = {
    imports: [],
    schemas: [],
    declarations: [],
    providers: [],
    ...moduleMetadata,
  };

  const { component: annotatedComponent } = createAnnotatedComponent(storyElement);

  TestBed.configureTestingModule({
    imports: [...moduleMeta.imports],
    declarations: [annotatedComponent, ...moduleMeta.declarations],
    providers: [...moduleMeta.providers],
    schemas: [NO_ERRORS_SCHEMA, ...moduleMeta.schemas],
  });

  // this is async. Should be somehow called in beforeEach
  TestBed.compileComponents();

  const tree = TestBed.createComponent(annotatedComponent);
  tree.detectChanges();

  return tree;

  // TestBed.configureTestingModule({
  //   imports: [...moduleMeta.imports],
  //   declarations: [component, ...moduleMeta.declarations],
  //   providers: [...moduleMeta.providers],
  //   schemas: [NO_ERRORS_SCHEMA, ...moduleMeta.schemas],
  // });
  //
  // TestBed.compileComponents();
  //
  // const tree = TestBed.createComponent(component);
  // tree.detectChanges();
  //
  // return tree;
}

export default getRenderedTree;
