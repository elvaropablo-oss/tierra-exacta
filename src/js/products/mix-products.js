export const verifiedAt='2026-09-12';

const affiliate={enabled:false,network:'awin',url:''};
const universalAliases=['sustrato universal','substrato universal','universal','tierra universal','tierra para macetas'];
const compostAliases=['compost','compost organico','compost orgánico','compost vegetal'];
const perliteAliases=['perlita','perlite'];
const cocoAliases=['fibra de coco','coco','coconut coir','coir'];

export const mixProducts=[
  {
    id:'leroy-compo-universal-5',
    category:'universal',
    aliases:universalAliases,
    name:'COMPO SANA sustrato universal 5 L',
    retailer:'Leroy Merlin',
    size:5,
    price:2.99,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/sustrato-universal-compo-sana-para-todo-tipo-de-plantas-interior-y-exterior-5l-259063.html',
    sourceUrl:'https://www.leroymerlin.es/productos/sustrato-universal-compo-sana-para-todo-tipo-de-plantas-interior-y-exterior-5l-259063.html',
    featureLabels:['5 L','Uso universal','Con perlita y abono NPK'],
    affiliate:{...affiliate}
  },
  {
    id:'bauhaus-flower-universal-eco-10',
    category:'universal',
    aliases:universalAliases,
    name:'Flower sustrato universal ecológico 10 L',
    retailer:'BAUHAUS',
    size:10,
    price:3.95,
    verifiedAt,
    normalUrl:'https://www.bauhaus.es/fertilizantes-de-plantas-y-universales/flower-sustrato-para-plantas-universal-ecologico/p/31509613',
    sourceUrl:'https://www.bauhaus.es/fertilizantes-de-plantas-y-universales/flower-sustrato-para-plantas-universal-ecologico/p/31509613',
    featureLabels:['10 L','Sin turba','Apto para agricultura ecológica'],
    affiliate:{...affiliate}
  },
  {
    id:'leroy-compo-universal-10',
    category:'universal',
    aliases:universalAliases,
    name:'COMPO SANA sustrato universal 10 L',
    retailer:'Leroy Merlin',
    size:10,
    price:4.69,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/sustrato-universal-compo-sana-para-todo-tipo-de-plantas-interior-y-exterior-10l-259035.html',
    sourceUrl:'https://www.leroymerlin.es/productos/sustrato-universal-compo-sana-para-todo-tipo-de-plantas-interior-y-exterior-10l-259035.html',
    featureLabels:['10 L','Uso universal','Con perlita y abono'],
    affiliate:{...affiliate}
  },
  {
    id:'leroy-compo-universal-20',
    category:'universal',
    aliases:universalAliases,
    name:'COMPO SANA sustrato universal 20 L',
    retailer:'Leroy Merlin',
    size:20,
    price:6.49,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/sustrato-universal-compo-sana-para-todo-tipo-de-plantas-interior-y-exterior-20l-258972.html',
    sourceUrl:'https://www.leroymerlin.es/productos/sustrato-universal-compo-sana-para-todo-tipo-de-plantas-interior-y-exterior-20l-258972.html',
    featureLabels:['20 L','Uso universal','Con perlita y abono'],
    affiliate:{...affiliate}
  },
  {
    id:'leroy-compo-universal-25',
    category:'universal',
    aliases:universalAliases,
    name:'COMPO SANA sustrato universal confort 25 L',
    retailer:'Leroy Merlin',
    size:25,
    price:9.99,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/sustrato-universal-compo-sana-para-todo-tipo-de-plantas-en-bolsa-confort-25l-12362616.html',
    sourceUrl:'https://www.leroymerlin.es/productos/sustrato-universal-compo-sana-para-todo-tipo-de-plantas-en-bolsa-confort-25l-12362616.html',
    featureLabels:['25 L','Uso universal','Bolsa confort con asa'],
    affiliate:{...affiliate}
  },
  {
    id:'leroy-universal-compost-50',
    category:'universal',
    aliases:universalAliases,
    name:'Sustrato universal 100 % compost vegetal 50 L',
    retailer:'Leroy Merlin',
    size:50,
    price:4.99,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/sustrato-universal-para-todo-tipo-de-plantas-50l-14662865.html',
    sourceUrl:'https://www.leroymerlin.es/productos/sustrato-universal-para-todo-tipo-de-plantas-50l-14662865.html',
    featureLabels:['50 L','Uso universal','Composición declarada: 100 % compost vegetal'],
    affiliate:{...affiliate}
  },
  {
    id:'manomano-bioflower-compost-20',
    category:'compost',
    aliases:compostAliases,
    name:'BioFlower compost orgánico 20 L',
    retailer:'ManoMano',
    size:20,
    price:16.21,
    verifiedAt,
    normalUrl:'https://www.manomano.es/p/compost-organico-bioflower-20-l-34825006',
    sourceUrl:'https://www.manomano.es/p/compost-organico-bioflower-20-l-34825006',
    featureLabels:['20 L','Compost orgánico','Enmienda para mezclar con sustrato'],
    affiliate:{...affiliate}
  },
  {
    id:'leroy-masso-perlita-5',
    category:'perlita',
    aliases:perliteAliases,
    name:'MASSÓ perlita 5 L',
    retailer:'Leroy Merlin',
    size:5,
    price:4.49,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/perlita-masso-5l-para-0-25-m2-16239650.html',
    sourceUrl:'https://www.leroymerlin.es/productos/perlita-masso-5l-para-0-25-m2-16239650.html',
    featureLabels:['5 L','Perlita','Aireación y retención hídrica'],
    affiliate:{...affiliate}
  },
  {
    id:'bauhaus-flower-perlita-5',
    category:'perlita',
    aliases:perliteAliases,
    name:'Flower perlita 5 L',
    retailer:'BAUHAUS',
    size:5,
    price:4.75,
    verifiedAt,
    normalUrl:'https://www.bauhaus.es/activadores-del-suelo-y-fortificacion-de-plantas/flower-perlita/p/27518566',
    sourceUrl:'https://www.bauhaus.es/activadores-del-suelo-y-fortificacion-de-plantas/flower-perlita/p/27518566',
    featureLabels:['5 L','Silicato volcánico','Mejora drenaje y aireación'],
    affiliate:{...affiliate}
  },
  {
    id:'leroy-masso-coco-5',
    category:'coco',
    aliases:cocoAliases,
    name:'MASSÓ fibra de coco 5 L',
    retailer:'Leroy Merlin',
    size:5,
    price:5.49,
    verifiedAt,
    normalUrl:'https://www.leroymerlin.es/productos/fibra-de-coco-masso-5l-16239643.html',
    sourceUrl:'https://www.leroymerlin.es/productos/fibra-de-coco-masso-5l-16239643.html',
    featureLabels:['5 L','Fibra de coco','Apto para agricultura ecológica'],
    affiliate:{...affiliate}
  }
];
