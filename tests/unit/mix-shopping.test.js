import test from 'node:test';
import assert from 'node:assert/strict';
import { substrateMix } from '../../src/js/math/soil.js';
import { buildMixShopping, matchMixProduct, packMixComponent, productsForMixComponent, rankMixOptions } from '../../src/js/math/mix-shopping.js';
import { mixProducts } from '../../src/js/products/mix-products.js';

test('encuentra productos por nombres habituales sin depender de mayúsculas o tildes',()=>{
  assert.equal(matchMixProduct('Sustrato universal',mixProducts)?.category,'universal');
  assert.equal(matchMixProduct('COMPOST ORGÁNICO',mixProducts)?.category,'compost');
  assert.equal(matchMixProduct('Perlita',mixProducts)?.category,'perlita');
  assert.equal(matchMixProduct('Fibra de coco',mixProducts)?.category,'coco');
});

test('no inventa una recomendación para un componente desconocido',()=>{
  assert.equal(matchMixProduct('Arena silícea',mixProducts),null);
  assert.deepEqual(productsForMixComponent('Arena silícea',mixProducts),[]);
});

test('redondea cada componente a envases completos',()=>{
  const universal=mixProducts.find(product=>product.id==='leroy-compo-universal-5');
  const purchase=packMixComponent(4.626,universal);
  assert.equal(purchase.units,1);
  assert.equal(purchase.purchased,5);
  assert.ok(Math.abs(purchase.leftover-0.374)<0.000001);
  assert.equal(purchase.cost,2.99);
});

test('compara varios formatos del mismo componente y pondera coste y ajuste',()=>{
  const universal=productsForMixComponent('Sustrato universal',mixProducts);
  assert.ok(universal.length>=5);
  const small=rankMixOptions(4.626,universal);
  assert.equal(small.recommended.product.id,'leroy-compo-universal-5');
  assert.equal(small.leastWaste.product.id,'leroy-compo-universal-5');
  const medium=rankMixOptions(18,universal);
  assert.equal(medium.recommended.product.id,'leroy-compo-universal-20');
  assert.equal(medium.recommended.purchase.units,1);
  assert.equal(medium.recommended.purchase.leftover,2);
  assert.ok(medium.recommended.balanceScore>80);
});

test('distingue la opción más barata de la que menos sobra',()=>{
  const universal=productsForMixComponent('Sustrato universal',mixProducts);
  const ranking=rankMixOptions(25,universal);
  assert.equal(ranking.cheapest.product.id,'leroy-universal-compost-50');
  assert.equal(ranking.leastWaste.product.id,'leroy-compo-universal-25');
  assert.ok(ranking.options.length>2);
});

test('calcula la compra recomendada del ejemplo 7,71 L al 60/25/15',()=>{
  const result=substrateMix({totalLitres:7.71,components:[
    {name:'Sustrato universal',percentage:60},
    {name:'Compost',percentage:25},
    {name:'Perlita',percentage:15}
  ]});
  const rows=buildMixShopping(result,mixProducts);
  assert.equal(rows.length,3);
  assert.deepEqual(rows.map(row=>row.recommended.purchase.units),[1,1,1]);
  assert.deepEqual(rows.map(row=>row.recommended.purchase.purchased),[5,20,5]);
  assert.deepEqual(rows.map(row=>row.recommended.product.id),['leroy-compo-universal-5','manomano-bioflower-compost-20','leroy-masso-perlita-5']);
  const total=rows.reduce((sum,row)=>sum+row.recommended.purchase.cost,0);
  assert.ok(Math.abs(total-23.69)<0.000001);
  assert.ok(rows[1].recommended.purchase.leftover/rows[1].recommended.purchase.purchased>.9);
});

test('el catálogo comercial conserva fuente, fecha y AWIN inactivo',()=>{
  assert.ok(mixProducts.length>=9);
  for(const product of mixProducts){
    assert.match(product.sourceUrl,/^https:\/\//);
    assert.equal(product.verifiedAt,'2026-09-12');
    assert.equal(product.affiliate.enabled,false);
    assert.equal(product.affiliate.network,'awin');
    assert.equal(product.affiliate.url,'');
    assert.ok(product.size>0);
    assert.ok(product.price>=0);
  }
});
