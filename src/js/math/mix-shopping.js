const fold=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();

const matchesAlias=(componentName,product)=>{
  const needle=fold(componentName);
  if(!needle)return false;
  return (product.aliases||[]).some(alias=>{
    const normalized=fold(alias);
    return needle===normalized||needle.includes(normalized)||normalized.includes(needle);
  });
};

export function matchMixCategory(componentName,products){
  return products.find(product=>matchesAlias(componentName,product))?.category||null;
}

export function productsForMixComponent(componentName,products){
  const category=matchMixCategory(componentName,products);
  return category?products.filter(product=>product.category===category):[];
}

export function matchMixProduct(componentName,products){
  return productsForMixComponent(componentName,products)[0]||null;
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
  return {required,units,purchased,leftover:purchased-required,waste:purchased-required,cost:units*price,projectCost:units*price};
}

export function rankMixOptions(requiredLitres,products,{economyWeight=.55,fitWeight=.45}={}){
  const candidates=(products||[]).map(product=>({product,purchase:packMixComponent(requiredLitres,product)}));
  if(!candidates.length)return {options:[],recommended:null,cheapest:null,leastWaste:null};
  const minCost=Math.min(...candidates.map(row=>row.purchase.cost));
  const totalWeight=Math.max(0,economyWeight)+Math.max(0,fitWeight)||1;
  const options=candidates.map(row=>{
    const economicScore=row.purchase.cost===0?100:minCost/row.purchase.cost*100;
    const fitScore=row.purchase.required/row.purchase.purchased*100;
    const balanceScore=candidates.length>1?(economicScore*Math.max(0,economyWeight)+fitScore*Math.max(0,fitWeight))/totalWeight:null;
    return {...row,economicScore,fitScore,balanceScore};
  }).sort((a,b)=>{
    if(a.balanceScore!==null||b.balanceScore!==null){
      if(a.balanceScore===null)return 1;
      if(b.balanceScore===null)return -1;
      if(Math.abs(b.balanceScore-a.balanceScore)>.000001)return b.balanceScore-a.balanceScore;
    }
    if(a.purchase.cost!==b.purchase.cost)return a.purchase.cost-b.purchase.cost;
    return a.purchase.leftover-b.purchase.leftover;
  });
  const cheapest=[...options].sort((a,b)=>a.purchase.cost-b.purchase.cost||a.purchase.leftover-b.purchase.leftover)[0];
  const leastWaste=[...options].sort((a,b)=>a.purchase.leftover-b.purchase.leftover||a.purchase.cost-b.purchase.cost)[0];
  return {options,recommended:options[0],cheapest,leastWaste};
}

export function buildMixShopping(result,products,weights){
  if(!result||!Array.isArray(result.components))return [];
  return result.components.map(component=>{
    const category=matchMixCategory(component.name,products);
    const candidates=category?products.filter(product=>product.category===category):[];
    const ranking=rankMixOptions(component.litres,candidates,weights);
    return {component,category,...ranking};
  });
}
