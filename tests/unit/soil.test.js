import test from 'node:test';
import assert from 'node:assert/strict';
import { rectangularContainer, roundContainer, substrateBags, substrateMix } from '../../src/js/math/soil.js';

test('calcula una maceta cilíndrica en litros', () => {
  const result = roundContainer({ shape: 'cylinder', topDiameter: 40, height: 30 });
  assert.ok(Math.abs(result.total - 37.6991118) < 0.0001);
});

test('calcula una maceta troncocónica', () => {
  const result = roundContainer({ topDiameter: 40, bottomDiameter: 30, height: 30 });
  assert.ok(Math.abs(result.total - 29.0597) < 0.001);
});

test('aplica borde, deducciones y cantidad', () => {
  const result = rectangularContainer({ length: 100, width: 40, height: 30, freeboard: 5, deductions: 10, count: 2 });
  assert.equal(result.grossEach, 100);
  assert.equal(result.each, 90);
  assert.equal(result.total, 180);
});

test('redondea los sacos hacia arriba y calcula sobrante y coste', () => {
  const result = substrateBags({ requiredLitres: 90, reserve: 10, bagSize: 40, price: 8.5 });
  assert.equal(result.bags, 3);
  assert.equal(result.purchased, 120);
  assert.ok(Math.abs(result.leftover - 21) < 0.001);
  assert.equal(result.cost, 25.5);
});

test('reparte una mezcla que suma cien', () => {
  const result = substrateMix({ totalLitres: 80, components: [{ name: 'Universal', percentage: 60 }, { name: 'Compost', percentage: 25 }, { name: 'Perlita', percentage: 15 }] });
  assert.deepEqual(result.components.map((item) => item.litres), [48, 20, 12]);
});

test('rechaza porcentajes que no suman cien', () => {
  assert.throws(() => substrateMix({ totalLitres: 50, components: [{ name: 'A', percentage: 60 }, { name: 'B', percentage: 30 }] }), /100/);
});

test('rechaza un borde mayor que la altura', () => {
  assert.throws(() => roundContainer({ topDiameter: 30, bottomDiameter: 20, height: 10, freeboard: 10 }), /menor/);
});
