import 'jest-preset-angular/setupJest';
import AngularSnapshotSerializer from 'jest-preset-angular/AngularSnapshotSerializer';
import HTMLCommentSerializer from 'jest-preset-angular/HTMLCommentSerializer';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import reactTestRenderer from 'react-test-renderer';
import shallow from 'react-test-renderer/shallow';
import { addSerializer } from 'jest-specific-snapshot';
import { getSnapshotFileName } from './utils';
import { createAnnotatedComponent } from './angular/helpers';

addSerializer(HTMLCommentSerializer);
addSerializer(AngularSnapshotSerializer);

function getRenderedTree(story, context, { renderer, serializer, ...rendererOptions }) {
  const storyElement = story.render(context);

  if (context.framework === 'angular') {
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

  const currentRenderer = renderer || reactTestRenderer.create;
  const tree = currentRenderer(storyElement, rendererOptions);
  return serializer ? serializer(tree) : tree;
}

export const snapshotWithOptions = options => ({ story, context, snapshotFileName }) => {
  const tree = getRenderedTree(story, context, options);

  if (snapshotFileName) {
    expect(tree).toMatchSpecificSnapshot(snapshotFileName);
  } else {
    expect(tree).toMatchSnapshot();
  }

  if (typeof tree.unmount === 'function') {
    tree.unmount();
  }
};

export const multiSnapshotWithOptions = options => ({ story, context }) => {
  snapshotWithOptions(options)({ story, context, snapshotFileName: getSnapshotFileName(context) });
};

export const snapshot = snapshotWithOptions({});

export function shallowSnapshot({ story, context, options: { renderer, serializer } }) {
  const shallowRenderer = renderer || shallow.createRenderer();
  const tree = shallowRenderer.render(story.render(context));
  const serializedTree = serializer ? serializer(tree) : tree;
  expect(serializedTree).toMatchSnapshot();
}

export function renderOnly({ story, context }) {
  const storyElement = story.render(context);
  reactTestRenderer.create(storyElement);
}
