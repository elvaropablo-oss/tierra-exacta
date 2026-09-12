import test from 'node:test';
import assert from 'node:assert/strict';
import { diagnosePlant } from '../../src/js/math/plant-care.js';

test('wet wilt with slow drainage prioritizes excess water and drainage', () => {
  const results = diagnosePlant({ symptom: 'wilt', moisture: 'wet', drainage: 'slow' });
  assert.equal(results[0].id, 'excess-water-drainage');
  assert.equal(results[0].productIntent, 'drainage');
});

test('dry wilt prioritizes lack of water', () => {
  const results = diagnosePlant({ symptom: 'wilt', moisture: 'dry', drainage: 'good' });
  assert.equal(results[0].id, 'dry-substrate');
  assert.equal(results[0].productIntent, 'water-management');
});

test('recent repot can surface transplant stress without assuming overwatering', () => {
  const results = diagnosePlant({ symptom: 'wilt', moisture: 'moist', drainage: 'good', recentRepot: true });
  assert.equal(results[0].id, 'transplant-stress');
  assert.equal(results[0].productIntent, 'repot');
});

test('visible roots surface root congestion', () => {
  const results = diagnosePlant({ symptom: 'unknown', moisture: 'moist', drainage: 'good', rootsVisible: true });
  assert.ok(results.some((result) => result.id === 'rootbound'));
});

test('yellow leaves keep multiple-cause warning when no stronger condition dominates', () => {
  const results = diagnosePlant({ symptom: 'yellow', moisture: 'moist', drainage: 'good' });
  assert.equal(results[0].id, 'yellow-multiple-causes');
});

test('unknown case returns a general check instead of inventing a diagnosis', () => {
  const results = diagnosePlant({ symptom: 'unknown', moisture: 'unknown', drainage: 'unknown' });
  assert.deepEqual(results.map((result) => result.id), ['general-check']);
});
