const fold=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

export function matchMixProduct(componentName,products){
  const needle=fold(componentName);
  if(!needle)return null;
  return products.find(product=>(product.aliases||[]).some(alias=>{
    const normalized=fold(alias);
    return needle===normalized||needle.includes(normalized)||normalized.includes(needle);
  }))||null;
}

export function packMixComponent(requiredLitres,product){
  const required=Number(requiredLitres);
  const size=Number(product?.size);
  const price=Number(product?.price);
  if(!Number.isFinite(required)||required<=0)throw new Error('Los litros necesarios deben ser mayores que cero.');
  if(!Number.isFinite(size)||size<=0)throw new Error('El formato comercial debe ser mayor que cero.');
  if(!Number.isFinite(price)||price<0)throw new Error('El precio del producto no puede ser negativo.');
  const units=Math.ceil(required/size);
  const purchased=units*size;
  return {required,units,purchased,leftover:purchased-required,cost:units*price};
}

export function buildMixShopping(result,products){
  if(!result||!Array.isArray(result.components))return [];
  return result.components.map(component=>{
    const product=matchMixProduct(component.name,products);
    return {
      component,
      product,
      purchase:product?packMixComponent(component.litres,product):null
    };
  });
}
