import test from 'node:test';
import assert from 'node:assert/strict';
import { substrateMix } from '../../src/js/math/soil.js';
import { buildMixShopping, matchMixProduct, packMixComponent } from '../../src/js/math/mix-shopping.js';
import { mixProducts } from '../../src/js/products/mix-products.js';

test('encuentra productos por nombres habituales sin depender de mayúsculas o tildes',()=>{
  assert.equal(matchMixProduct('Sustrato universal',mixProducts)?.category,'universal');
  assert.equal(matchMixProduct('COMPOST ORGÁNICO',mixProducts)?.category,'compost');
  assert.equal(matchMixProduct('Perlita',mixProducts)?.category,'perlita');
  assert.equal(matchMixProduct('Fibra de coco',mixProducts)?.category,'coco');
});

test('no inventa una recomendación para un componente desconocido',()=>{
  assert.equal(matchMixProduct('Arena silícea',mixProducts),null);
});

test('redondea cada componente a envases completos',()=>{
  const universal=mixProducts.find(product=>product.category==='universal');
  const purchase=packMixComponent(4.626,universal);
  assert.equal(purchase.units,1);
  assert.equal(purchase.purchased,5);
  assert.ok(Math.abs(purchase.leftover-0.374)<0.000001);
  assert.equal(purchase.cost,2.99);
});

test('calcula la compra del ejemplo 7,71 L al 60/25/15',()=>{
  const result=substrateMix({totalLitres:7.71,components:[
    {name:'Sustrato universal',percentage:60},
    {name:'Compost',percentage:25},
    {name:'Perlita',percentage:15}
  ]});
  const rows=buildMixShopping(result,mixProducts);
  assert.equal(rows.length,3);
  assert.deepEqual(rows.map(row=>row.purchase.units),[1,1,1]);
  assert.deepEqual(rows.map(row=>row.purchase.purchased),[5,20,5]);
  const total=rows.reduce((sum,row)=>sum+row.purchase.cost,0);
  assert.ok(Math.abs(total-23.95)<0.000001);
});

test('el catálogo comercial conserva fuente, fecha y AWIN inactivo',()=>{
  assert.ok(mixProducts.length>=4);
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
