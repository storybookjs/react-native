import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';
import SnapshotRunner from '../snapshot_runner';

describe('SnapshotRunner', () => {
  let runner;

  beforeEach(() => {
    runner = new SnapshotRunner('/path/to/config-dir');
    runner.startKind('TestKind');
    sinon.spy(runner.state.snapshot, 'add');
  });

  describe('runStory', () => {
    it('should call render with correct story context', async () => {
      runner.startKind('Foo Bar');

      const story = {
        name: 'baz quix',
        render: sinon.stub().returns(<div>baz quix</div>),
      };
      await runner.runStory(story, { update: false });

      expect(story.render.calledOnce).to.equal(true);
      const context = story.render.firstCall.args[0];
      expect(context.kind).to.equal('Foo Bar');
      expect(context.story).to.equal('baz quix');
    });

    describe('when the snapshot file does not exist', () => {
      beforeEach(() => {
        sinon.stub(runner.state.snapshot, 'fileExists').returns(false);
      });

      it('should add the current story as a snapshot', async () => {
        const story = {
          name: 'New story of a new kind',
          render: sinon.stub().returns(<div />),
        };
        const result = await runner.runStory(story, { update: false });
        expect(runner.state.snapshot.add.calledOnce).to.equal(true);
        expect(result.state).to.equal('added');
      });
    });

    describe('when the snapshot file exists', () => {
      beforeEach(() => {
        sinon.stub(runner.state.snapshot, 'fileExists').returns(true);
      });

      describe('when the snapshot does not exist', () => {
        beforeEach(() => {
          sinon.stub(runner.state.snapshot, 'has').returns(false);
        });

        it('should add the current story as a snapshot', async () => {
          const story = {
            name: 'New story of an existing kind',
            render: sinon.stub().returns(<div />),
          };
          const result = await runner.runStory(story, { update: false });
          expect(runner.state.snapshot.add.calledOnce).to.equal(true);
          expect(result.state).to.equal('added');
        });
      });

      describe('when the snapshot exists', () => {
        beforeEach(() => {
          sinon.stub(runner.state.snapshot, 'has').returns(true);
        });

        it('should call matches with the story', async () => {
          sinon.stub(runner.state.snapshot, 'matches').returns({ pass: true });

          const story = {
            name: 'test story name',
            render: sinon.stub().returns(<div>Test story content</div>),
          };

          await runner.runStory(story, { update: false });
          expect(runner.state.snapshot.matches.calledOnce).to.equal(true);
          const args = runner.state.snapshot.matches.firstCall.args;
          expect(args[0]).to.equal('test story name');
          expect(args[1].children[0]).to.equal('Test story content');
        });

        describe('when story matches saved snapshot', () => {
          beforeEach(() => {
            sinon.stub(runner.state.snapshot, 'matches').returns({ pass: true });
          });

          it('should not add the current story as a snapshot', async () => {
            const story = {
              name: 'Story that matches with snapshot',
              render: sinon.stub().returns(<div />),
            };
            const result = await runner.runStory(story, { update: false });
            expect(runner.state.snapshot.add.calledOnce).to.equal(false);
            expect(result.state).to.equal('matched');
          });
        });

        describe('when story does not match saved snapshot', () => {
          beforeEach(() => {
            sinon.stub(runner.state.snapshot, 'matches').returns({
              pass: false,
              expected: 'expected source (snapshot)',
              actual: 'actual source (story)',
            });
          });

          it('should add the current story as a snapshot if updating', async () => {
            const story = {
              name: 'Story that does not match with snapshot',
              render: sinon.stub().returns(<div />),
            };
            const result = await runner.runStory(story, { update: true });
            expect(runner.state.snapshot.add.calledOnce).to.equal(true);
            expect(result.state).to.equal('updated');
          });

          it('should not add the current story as a snapshot if not updating', async () => {
            const story = {
              name: 'New story of an existing kind',
              render: sinon.stub().returns(<div />),
            };
            const result = await runner.runStory(story, { update: false });
            expect(runner.state.snapshot.add.calledOnce).to.equal(false);
            expect(result.state).to.equal('unmatched');
          });

          describe('when in interactive mode', () => {
            describe('update confirmed', () => {
              beforeEach(() => {
                sinon.stub(runner, 'confirmUpate').returns(Promise.resolve(true));
              });

              it('should update', async () => {
                const story = {
                  name: 'New story of an existing kind',
                  render: sinon.stub().returns(<div />),
                };
                const result = await runner.runStory(story, { update: false, interactive: true });
                expect(runner.confirmUpate.calledOnce).to.equal(true);
                expect(runner.state.snapshot.add.calledOnce).to.equal(true);
                expect(result.state).to.equal('updated');
              });
            });

            describe('update not confirmed', () => {
              beforeEach(() => {
                sinon.stub(runner, 'confirmUpate').returns(Promise.resolve(false));
              });

              it('should update', async () => {
                const story = {
                  name: 'New story of an existing kind',
                  render: sinon.stub().returns(<div />),
                };
                const result = await runner.runStory(story, { update: false, interactive: true });
                expect(runner.confirmUpate.calledOnce).to.equal(true);
                expect(runner.state.snapshot.add.calledOnce).to.equal(false);
                expect(result.state).to.equal('unmatched');
              });
            });
          });
        });
      });
    });
  });
});
