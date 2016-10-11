import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import SnapshotRunner from '../snapshot_runner';

describe('SnapshotRunner', () => {
  let runner;

  beforeEach(() => {
    runner = new SnapshotRunner(
      { configDir: '/path/to/config-dir', update: false, interactive: false });
    runner.startKind('TestKind');
  });

  describe('runStory', () => {
    it('should call render with correct story context', async () => {
      runner.startKind('Foo Bar');

      const story = {
        name: 'baz quix',
        render: sinon.stub().returns(<div>baz quix</div>),
      };
      await runner.runStory(story);

      expect(story.render.calledOnce).to.equal(true);
      const context = story.render.firstCall.args[0];
      expect(context.kind).to.equal('Foo Bar');
      expect(context.story).to.equal('baz quix');
    });

    describe('when story does not match saved snapshot', () => {
      beforeEach(() => {
        sinon.stub(runner, 'getOutcome').returns('unmatched');
        sinon.stub(runner.state, 'match').returns({
          expected: 'expected serialized component',
          actual: 'actual serialized component',
        });
      });

      describe('when in interactive mode', () => {
        beforeEach(() => {
          runner.interactive = true;
        });

        describe('update confirmed', () => {
          beforeEach(() => {
            sinon.stub(runner, 'confirmUpate').returns(Promise.resolve(true));
          });

          it('result should be `updated`', async () => {
            const story = {
              name: 'Updated story',
              render: sinon.stub().returns(<div />),
            };
            const result = await runner.runStory(story);
            expect(runner.confirmUpate.calledOnce).to.equal(true);
            expect(result.state).to.equal('updated');
          });
        });

        describe('update not confirmed', () => {
          beforeEach(() => {
            sinon.stub(runner, 'confirmUpate').returns(Promise.resolve(false));
          });

          it('result should be `unmatched`', async () => {
            const story = {
              name: 'New story of an existing kind',
              render: sinon.stub().returns(<div />),
            };
            const result = await runner.runStory(story, { update: false, interactive: true });

            expect(runner.confirmUpate.calledOnce).to.equal(true);
            expect(result.state).to.equal('unmatched');
          });
        });
      });
    });
  });
});
