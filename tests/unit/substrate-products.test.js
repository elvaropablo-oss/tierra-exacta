import test from 'node:test';
import assert from 'node:assert/strict';
import { substrateCriteria, substrateProducts, verifiedAt } from '../../src/js/products/substrate-products.js';

test('el catálogo tiene identificadores únicos y datos mínimos válidos', () => {
  assert.ok(substrateProducts.length >= 5);
  assert.equal(new Set(substrateProducts.map((product) => product.id)).size, substrateProducts.length);
  for (const product of substrateProducts) {
    assert.ok(product.id);
    assert.ok(product.name);
    assert.ok(product.retailer);
    assert.ok(Number.isFinite(product.price) && product.price > 0, `${product.id}: precio inválido`);
    assert.ok(Number.isFinite(product.size) && product.size > 0, `${product.id}: tamaño inválido`);
    assert.match(product.normalUrl, /^https:\/\//, `${product.id}: URL oficial inválida`);
    assert.match(product.sourceUrl, /^https:\/\//, `${product.id}: fuente inválida`);
    assert.equal(product.verifiedAt, verifiedAt);
  }
});

test('AWIN permanece desactivado hasta disponer de enlaces reales', () => {
  for (const product of substrateProducts) {
    assert.equal(product.affiliate?.enabled, false, `${product.id}: afiliación activada sin validación`);
    assert.equal(product.affiliate?.network, 'awin');
    assert.equal(product.affiliate?.url, '');
  }
});

test('los criterios técnicos suman 100 puntos y existen en todos los productos', () => {
  assert.equal(substrateCriteria.reduce((sum, criterion) => sum + criterion.weight, 0), 100);
  for (const product of substrateProducts) {
    for (const criterion of substrateCriteria) {
      assert.ok(Object.hasOwn(product.specs, criterion.key), `${product.id}: falta ${criterion.key}`);
      assert.ok([true, false, null].includes(product.specs[criterion.key]), `${product.id}: ${criterion.key} no es boolean/null`);
    }
  }
});

test('la fecha de verificación usa formato ISO', () => {
  assert.match(verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(!Number.isNaN(new Date(`${verifiedAt}T00:00:00Z`).getTime()));
});
