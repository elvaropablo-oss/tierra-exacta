export const verifiedAt='2026-09-12';

export const substrateCriteria=[
  {key:'universal',label:'Uso universal',type:'boolean',weight:15},
  {key:'nutrients',label:'Nutrientes o abono declarados',type:'boolean',weight:20},
  {key:'aeration',label:'Aireación o drenaje declarados',type:'boolean',weight:20},
  {key:'waterManagement',label:'Retención o ahorro de agua declarado',type:'boolean',weight:20},
  {key:'peatFree',label:'Sin turba',type:'boolean',weight:15},
  {key:'organicEligible',label:'Apto para agricultura ecológica',type:'boolean',weight:10}
];

const affiliate={enabled:false,network:'awin',url:''};

export const substrateProducts=[
  {
    id:'leroy-universal-50',
    name:'Sustrato universal para todo tipo de plantas 50 L',
    retailer:'Leroy Merlin',
    price:4.99,
    size:50,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/sustrato-universal-para-todo-tipo-de-plantas-50l-14662865.html',
    sourceUrl:'https://www.leroymerlin.es/productos/sustrato-universal-para-todo-tipo-de-plantas-50l-14662865.html',
    specs:{universal:true,nutrients:null,aeration:null,waterManagement:null,peatFree:null,organicEligible:false},
    featureLabels:['50 L','Compost vegetal 100%','pH 6'],
    affiliate:{...affiliate}
  },
  {
    id:'leroy-geolia-50',
    name:'GEOLIA sustrato universal 50 L',
    retailer:'Leroy Merlin',
    price:7.49,
    size:50,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/sustrato-universal-geolia-para-todo-tipo-de-plantas-de-interior-y-exterior-50l-14657363.html',
    sourceUrl:'https://www.leroymerlin.es/productos/sustrato-universal-geolia-para-todo-tipo-de-plantas-de-interior-y-exterior-50l-14657363.html',
    specs:{universal:true,nutrients:true,aeration:true,waterManagement:true,peatFree:false,organicEligible:false},
    featureLabels:['50 L','Turba, perlita y compost','Abono para 3 semanas','pH 6'],
    affiliate:{...affiliate}
  },
  {
    id:'leroy-geolia-peatfree-50',
    name:'GEOLIA universal ecológico sin turba 50 L',
    retailer:'Leroy Merlin',
    price:7.99,
    size:50,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/sustrato-libre-de-turba-universal-50l-geolia-100-ecologico-84867708.html',
    sourceUrl:'https://www.leroymerlin.es/productos/sustrato-libre-de-turba-universal-50l-geolia-100-ecologico-84867708.html',
    specs:{universal:true,nutrients:true,aeration:true,waterManagement:true,peatFree:true,organicEligible:true},
    featureLabels:['50 L','Sin turba','Fibra de coco + perlita','Apto agricultura ecológica','pH 6'],
    affiliate:{...affiliate}
  },
  {
    id:'bauhaus-universal-40',
    name:'BAUHAUS sustrato universal 40 L',
    retailer:'BAUHAUS',
    price:6.25,
    size:40,
    verifiedAt,
    normalUrl:'https://www.bauhaus.es/tierra-universal/bauhaus-substrato-de-planta-universal/p/27479469',
    sourceUrl:'https://www.bauhaus.es/tierra-universal/bauhaus-substrato-de-planta-universal/p/27479469',
    specs:{universal:true,nutrients:true,aeration:true,waterManagement:true,peatFree:false,organicEligible:null},
    featureLabels:['40 L','Con nutrientes','Mejora aireación y drenaje','Retención de agua'],
    affiliate:{...affiliate}
  },
  {
    id:'bauhaus-eco-peatfree-40',
    name:'BAUHAUS universal ecológico sin turba 40 L',
    retailer:'BAUHAUS',
    price:7.95,
    size:40,
    verifiedAt,
    normalUrl:'https://www.bauhaus.es/tierra-universal/bauhaus-substrato-de-planta-universal-ecologico-sin-turba/p/29196153',
    sourceUrl:'https://www.bauhaus.es/tierra-universal/bauhaus-substrato-de-planta-universal-ecologico-sin-turba/p/29196153',
    specs:{universal:true,nutrients:true,aeration:true,waterManagement:true,peatFree:true,organicEligible:true},
    featureLabels:['40 L','Sin turba','Fibra de coco + perlita','Apto agricultura ecológica'],
    affiliate:{...affiliate}
  },
  {
    id:'manomano-jardin202-20',
    name:'JARDIN202 sustrato universal premium 20 L',
    retailer:'ManoMano',
    price:5.43,
    size:20,
    verifiedAt,
    normalUrl:'https://www.manomano.es/p/sustrato-universal-premium-con-fibras-de-coco-turbas-sustrato-vegetal-perlita-y-enriquecido-ideal-para-todo-tipo-de-plantas-83134666?model_id=88070510',
    sourceUrl:'https://www.manomano.es/p/sustrato-universal-premium-con-fibras-de-coco-turbas-sustrato-vegetal-perlita-y-enriquecido-ideal-para-todo-tipo-de-plantas-83134666?model_id=88070510',
    specs:{universal:true,nutrients:true,aeration:true,waterManagement:true,peatFree:false,organicEligible:null},
    featureLabels:['20 L','Fibra de coco + perlita','Abono NPK','Retención de agua y aire','pH 7,37'],
    affiliate:{...affiliate}
  }
];
