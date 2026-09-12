import { breadcrumbs, button, hero } from '../templates/site.mjs';

const baseUrl = 'https://elvaropablo-oss.github.io/tierra-exacta/';
const careCrumbs = (label, path) => breadcrumbs([{ label: 'Inicio', path: '' }, { label: 'Cuidados', path: 'cuidados/' }, { label, path }]);
const sourceLink = (url, label) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
const card = (title, text, path, label = 'Ver guía') => `<article class="care-hub-card"><h2>${title}</h2><p>${text}</p>${button(path, label, true)}</article>`;

const sources = {
  rhsPoorly: 'https://www.rhs.org.uk/plants/types/houseplants/how-to-help-a-poorly-houseplant',
  rhsRepot: 'https://www.rhs.org.uk/container-gardening/how-to-repot-a-plant',
  rhsLeaf: 'https://www.rhs.org.uk/prevention-protection/leaf-damage-on-houseplants',
  pennRepot: 'https://extension.psu.edu/repotting-houseplants',
  pennTransplant: 'https://extension.psu.edu/transplanting-annuals-into-the-garden',
  illinoisStart: 'https://extension.illinois.edu/houseplants/get-started',
  illinoisTrouble: 'https://extension.illinois.edu/houseplants/troubleshooting'
};

function articleSchema(title, description, path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${baseUrl}${path}/`,
    inLanguage: 'es-ES',
    author: { '@type': 'Organization', name: 'TierraExacta' },
    publisher: { '@type': 'Organization', name: 'TierraExacta' }
  };
}

function relatedProducts(intent) {
  return `<div class="care-related-products" data-care-products="${intent}"></div>`;
}

function sourceSection(items) {
  return `<section class="care-sources"><p class="eyebrow">Fuentes consultadas</p><h2>En qué se basa esta guía</h2><p>${items.join(' · ')}</p><p>Las respuestas son orientativas: especies distintas pueden reaccionar de forma diferente y un mismo síntoma puede tener varias causas.</p></section>`;
}

const hub = {
  path: 'cuidados',
  h1: 'Cuidados y problemas comunes de plantas',
  title: 'Cuidados de plantas: síntomas, riego y trasplante | TierraExacta',
  description: 'Guías para entender plantas mustias, hojas amarillas, exceso de riego, drenaje, raíces apretadas y problemas después de un trasplante.',
  schema: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Cuidados y problemas comunes de plantas', url: `${baseUrl}cuidados/`, inLanguage: 'es-ES' },
  content: `${breadcrumbs([{ label: 'Inicio', path: '' }, { label: 'Cuidados', path: 'cuidados/' }])}
    ${hero('Diagnóstico antes de comprar', 'Cuidados y problemas comunes de plantas', 'Un síntoma no es un diagnóstico. Empieza por humedad, drenaje, raíces y cambios recientes; después decide si realmente necesitas cambiar el sustrato o el recipiente.', `${button('diagnostico-planta/', 'Diagnosticar síntomas')}${button('cuidados/planta-mustia-despues-trasplante/', 'Planta mustia tras trasplante', true)}`, false)}
    <section class="care-hub-grid">
      ${card('Planta mustia después de trasplantar', 'Qué comprobar si las hojas caen o la planta se ve vencida tras cambiarla de maceta.', 'cuidados/planta-mustia-despues-trasplante/')}
      ${card('Hojas amarillas', 'Riego, luz, temperatura, raíces y nutrientes pueden producir el mismo síntoma.', 'cuidados/hojas-amarillas/')}
      ${card('¿Estoy regando demasiado?', 'Diferencia un sustrato simplemente húmedo de una situación persistente de saturación.', 'cuidados/exceso-riego/')}
      ${card('El sustrato no drena', 'Qué revisar cuando el agua tarda demasiado en salir o el sustrato permanece empapado.', 'cuidados/sustrato-no-drena/')}
      ${card('Raíces por los agujeros de la maceta', 'Cómo comprobar si la planta está congestionada y cuándo pasar a un recipiente algo mayor.', 'cuidados/raices-salen-maceta/')}
      ${card('Diagnóstico guiado', 'Responde seis preguntas y recibe un orden de comprobaciones, no una etiqueta automática.', 'diagnostico-planta/', 'Abrir diagnóstico')}
    </section>
    <section class="care-principles"><div><p class="eyebrow">Regla de TierraExacta</p><h2>Primero condiciones, después productos</h2></div><div class="care-principle-grid"><article><strong>01</strong><h3>Comprueba humedad</h3><p>Marchitarse no significa siempre falta de agua: también puede ocurrir con exceso de riego.</p></article><article><strong>02</strong><h3>Mira el drenaje</h3><p>Agua retenida en el fondo o una maceta sin salida cambia completamente el diagnóstico.</p></article><article><strong>03</strong><h3>Piensa en cambios recientes</h3><p>Trasplante, nueva ubicación, luz o temperatura pueden provocar una fase de adaptación.</p></article><article><strong>04</strong><h3>Compra solo si corrige una causa</h3><p>Un producto no arregla por sí mismo un problema de riego, luz o raíces dañadas.</p></article></div></section>`
};

const diagnostic = {
  path: 'diagnostico-planta',
  tool: true,
  h1: 'Diagnóstico orientativo de una planta con problemas',
  title: '¿Qué le pasa a mi planta? Diagnóstico orientativo | TierraExacta',
  description: 'Responde preguntas sobre síntomas, humedad, drenaje, trasplante y raíces para ordenar las causas más probables que conviene comprobar.',
  content: `${careCrumbs('Diagnóstico', 'diagnostico-planta/')} ${hero('Seis comprobaciones', '¿Qué le pasa a mi planta?', 'No intentamos identificar una enfermedad por una sola hoja. La herramienta combina síntomas y condiciones para decirte qué revisar primero.', '', false)}
    <section class="care-diagnostic-layout"><form class="care-diagnostic-form" data-plant-diagnostic>
      <fieldset><legend>1. Síntoma principal</legend><label>¿Qué ves?<select name="symptom"><option value="wilt">Hojas o tallos mustios</option><option value="yellow">Hojas amarillas</option><option value="drop">Caída de hojas</option><option value="brown">Bordes o puntas marrones</option><option value="unknown">Otro / no estoy seguro</option></select></label></fieldset>
      <fieldset><legend>2. Humedad del sustrato</legend><label>Unos centímetros bajo la superficie está…<select name="moisture"><option value="wet">Muy húmedo o empapado</option><option value="moist">Ligeramente húmedo</option><option value="dry">Seco</option><option value="unknown">No lo sé</option></select></label></fieldset>
      <fieldset><legend>3. Drenaje</legend><label>¿Qué ocurre al regar?<select name="drainage"><option value="good">El agua sale con normalidad</option><option value="slow">Tarda mucho en salir / queda saturado</option><option value="none">La maceta no tiene agujeros de drenaje</option><option value="unknown">No lo sé</option></select></label></fieldset>
      <fieldset class="care-radio-group"><legend>4. Cambios recientes</legend><label><input type="checkbox" name="recentRepot" value="yes"> La he trasplantado recientemente</label><label><input type="checkbox" name="recentMove" value="yes"> La he cambiado de sitio o de condiciones</label><label><input type="checkbox" name="rootsVisible" value="yes"> Veo raíces saliendo por los agujeros o muy apretadas</label></fieldset>
      <div class="care-diagnostic-actions"><button class="button button--clay" type="submit">Ordenar causas a revisar</button><button class="button button--quiet" type="reset">Empezar de nuevo</button></div>
    </form><section class="care-diagnostic-result" data-plant-diagnostic-result tabindex="-1" aria-live="polite" hidden></section></section>
    <section class="care-warning"><h2>Qué no hace esta herramienta</h2><p>No identifica hongos, bacterias, plagas ni toxicidades específicas y no conoce la especie de tu planta. Si ves pudrición extensa, daños que avanzan rápidamente, plagas claras o una planta de especial valor, busca una identificación específica antes de aplicar tratamientos.</p></section>
    ${sourceSection([sourceLink(sources.rhsPoorly, 'RHS: ayudar a una planta de interior con problemas'), sourceLink(sources.illinoisTrouble, 'Illinois Extension: troubleshooting de plantas')])}`
};

const wiltAfterTransplant = {
  path: 'cuidados/planta-mustia-despues-trasplante',
  h1: 'Mi planta está mustia después de trasplantarla: qué revisar',
  title: 'Planta mustia después de trasplantar: causas y qué hacer | TierraExacta',
  description: 'Qué comprobar si una planta se queda mustia después de un trasplante: humedad, raíces, drenaje, luz y adaptación.',
  schema: articleSchema('Planta mustia después de trasplantar: qué revisar', 'Guía para ordenar las causas habituales del marchitamiento tras un trasplante.', 'cuidados/planta-mustia-despues-trasplante'),
  content: `${careCrumbs('Mustia tras trasplante', 'cuidados/planta-mustia-despues-trasplante/')} ${hero('Estrés de trasplante', 'Mi planta está mustia después de trasplantarla: qué revisar', 'Las raíces finas pueden quedar alteradas durante el trasplante y absorber temporalmente menos agua. Pero regar más sin comprobar la humedad puede empeorar un problema de drenaje.', `${button('diagnostico-planta/', 'Hacer diagnóstico guiado')}`, false)}
    <article class="care-guide"><section><p class="eyebrow">Primero</p><h2>Toca el sustrato antes de volver a regar</h2><p>Comprueba la humedad unos centímetros bajo la superficie. Si está seco, un riego completo puede ser necesario. Si sigue muy húmedo, añadir más agua no soluciona el marchitamiento y obliga a revisar drenaje y raíces.</p></section><section><p class="eyebrow">Después</p><h2>Comprueba que el agua pueda salir</h2><p>La maceta debería permitir que el exceso de agua abandone el recipiente. Tras el primer riego de un trasplante, observa que el agua atraviesa el sustrato y sale por los agujeros.</p></section><section><p class="eyebrow">Durante la adaptación</p><h2>Evita encadenar más cambios</h2><p>Un cambio brusco de ubicación, luz o temperatura puede sumar estrés. Mantén unas condiciones apropiadas y estables para la especie mientras observas la evolución.</p></section><section><p class="eyebrow">Si el problema persiste</p><h2>Revisa el cepellón y el tamaño de la maceta</h2><p>Una maceta excesivamente grande puede mantener demasiado sustrato húmedo durante más tiempo. Si las raíces estaban muy congestionadas o resultaron dañadas, la recuperación también puede ser más lenta.</p></section></article>
    ${relatedProducts('repot')}
    ${sourceSection([sourceLink(sources.pennTransplant, 'Penn State Extension: estrés de trasplante'), sourceLink(sources.rhsRepot, 'RHS: cómo trasplantar una planta'), sourceLink(sources.illinoisStart, 'Illinois Extension: maceta, drenaje y adaptación')])}`
};

const yellowLeaves = {
  path: 'cuidados/hojas-amarillas',
  h1: 'Hojas amarillas en una planta: cómo buscar la causa',
  title: 'Hojas amarillas en plantas: causas que conviene comprobar | TierraExacta',
  description: 'Las hojas amarillas pueden aparecer por riego, drenaje, luz, temperatura, raíces o nutrientes. Aprende qué comprobar antes de actuar.',
  schema: articleSchema('Hojas amarillas en una planta: cómo buscar la causa', 'Guía para diferenciar causas comunes de amarilleo en plantas de maceta.', 'cuidados/hojas-amarillas'),
  content: `${careCrumbs('Hojas amarillas', 'cuidados/hojas-amarillas/')} ${hero('Un síntoma, muchas causas', 'Hojas amarillas en una planta: cómo buscar la causa', 'El amarilleo por sí solo no indica qué producto falta. Empieza por agua, drenaje, luz, temperatura y raíces; los nutrientes se evalúan después.', `${button('diagnostico-planta/', 'Comprobar mi caso')}`, false)}
    <article class="care-guide"><section><h2>1. ¿Está el sustrato empapado?</h2><p>El exceso de riego puede causar amarilleo y caída de hojas. Comprueba la humedad real y si queda agua acumulada en el cubremaceta o plato.</p></section><section><h2>2. ¿Está demasiado seco?</h2><p>La falta de agua también puede amarillear hojas, sobre todo si aparece junto a marchitamiento o bordes secos. La diferencia está en el estado del sustrato, no en el color por sí solo.</p></section><section><h2>3. ¿Ha cambiado la luz o la temperatura?</h2><p>Una nueva ubicación, corrientes frías o cambios bruscos pueden provocar pérdida de color y caída de hojas mientras la planta se adapta.</p></section><section><h2>4. ¿La maceta está demasiado llena de raíces?</h2><p>Un cepellón congestionado puede alterar el reparto del agua y el crecimiento. Si ves raíces saliendo por los agujeros, comprueba el cepellón antes de aumentar el abono.</p></section><section><h2>5. Nutrientes: no los asumas como primera causa</h2><p>Las deficiencias existen, pero el estrés de raíces, el pH y el riego pueden impedir que una planta use nutrientes aunque estén presentes. Antes de fertilizar, descarta las condiciones básicas.</p></section></article>
    ${sourceSection([sourceLink(sources.rhsLeaf, 'RHS: daños y hojas amarillas'), sourceLink(sources.rhsPoorly, 'RHS: planta de interior con problemas'), sourceLink(sources.illinoisTrouble, 'Illinois Extension: causas de problemas comunes')])}`
};

const overwatering = {
  path: 'cuidados/exceso-riego',
  h1: 'Cómo saber si una planta tiene exceso de riego',
  title: 'Exceso de riego en plantas: señales y qué comprobar | TierraExacta',
  description: 'Aprende a distinguir exceso de riego de falta de agua revisando humedad, drenaje, raíces y síntomas asociados.',
  schema: articleSchema('Cómo saber si una planta tiene exceso de riego', 'Guía sobre saturación, drenaje y síntomas que pueden confundirse con falta de agua.', 'cuidados/exceso-riego'),
  content: `${careCrumbs('Exceso de riego', 'cuidados/exceso-riego/')} ${hero('No riegues por calendario', 'Cómo saber si una planta tiene exceso de riego', 'Una planta con demasiada agua puede estar mustia. La comprobación útil es combinar el síntoma con el estado del sustrato y el drenaje.', `${button('diagnostico-planta/', 'Evaluar síntomas')}`, false)}
    <article class="care-guide"><section><h2>Señales que hacen sospechar de exceso de agua</h2><p>Sustrato que permanece muy húmedo durante mucho tiempo, agua acumulada, hojas amarillas o que caen y tejidos blandos son señales que justifican revisar el riego y las raíces.</p></section><section><h2>Qué hacer primero</h2><p>Detén el riego automático por calendario y comprueba cuándo vuelve a necesitar agua la especie. Vacía el agua retenida en recipientes exteriores y asegúrate de que existe una salida efectiva.</p></section><section><h2>Cuándo mirar el sustrato</h2><p>Si incluso con una maceta con agujeros la mezcla permanece saturada durante demasiado tiempo, puede estar muy compactada o no ser apropiada para esa planta y esas condiciones.</p></section><section><h2>Evita el error contrario</h2><p>No pases de exceso de agua a dejar secar indiscriminadamente una especie que necesita humedad. La frecuencia correcta depende de planta, recipiente, mezcla, luz, temperatura y época.</p></section></article>
    ${relatedProducts('drainage')}
    ${sourceSection([sourceLink(sources.rhsPoorly, 'RHS: exceso de agua y marchitamiento'), sourceLink(sources.illinoisStart, 'Illinois Extension: drenaje y tamaño de maceta')])}`
};

const poorDrainage = {
  path: 'cuidados/sustrato-no-drena',
  h1: 'Qué hacer si el sustrato de una maceta no drena bien',
  title: 'Sustrato que no drena: causas y cómo revisarlo | TierraExacta',
  description: 'Qué comprobar cuando un sustrato tarda en drenar, se queda empapado o se ha compactado en una maceta.',
  schema: articleSchema('Qué hacer si el sustrato de una maceta no drena bien', 'Guía para revisar agujeros, compactación, raíces congestionadas y elección de mezcla.', 'cuidados/sustrato-no-drena'),
  content: `${careCrumbs('Sustrato que no drena', 'cuidados/sustrato-no-drena/')} ${hero('Aire y agua en las raíces', 'Qué hacer si el sustrato de una maceta no drena bien', 'Antes de comprar otra mezcla, comprueba si el problema está en el recipiente, en el sustrato o en un cepellón excesivamente congestionado.', `${button('sacos-sustrato/', 'Comparar sustratos', true)}`, false)}
    <article class="care-guide"><section><h2>1. Confirma que hay salida de agua</h2><p>Una maceta decorativa sin agujeros puede retener agua aunque el sustrato sea adecuado. Si usas un cubremaceta, comprueba que el recipiente interior pueda escurrir y que no quede sumergido.</p></section><section><h2>2. Observa cuánto tarda en atravesar el sustrato</h2><p>Si el agua queda en superficie o el conjunto permanece saturado de forma persistente, la estructura de la mezcla puede haberse degradado o compactado.</p></section><section><h2>3. Comprueba las raíces</h2><p>Una masa de raíces muy congestionada puede impedir que el agua circule con normalidad. En ese caso, cambiar solo la frecuencia de riego no resuelve el espacio disponible.</p></section><section><h2>4. Si renuevas el sustrato, busca características declaradas</h2><p>No todos los productos sirven para todas las plantas. TierraExacta solo marca “aireación o drenaje” cuando la ficha del producto lo declara; después debes comprobar que la mezcla encaje con la especie.</p></section></article>
    ${relatedProducts('drainage')}
    ${sourceSection([sourceLink(sources.rhsRepot, 'RHS: raíces congestionadas, aireación y drenaje'), sourceLink(sources.illinoisStart, 'Illinois Extension: recipientes y mezclas con drenaje')])}`
};

const rootsOut = {
  path: 'cuidados/raices-salen-maceta',
  h1: 'Raíces saliendo por debajo de la maceta: ¿hay que trasplantar?',
  title: 'Raíces saliendo de la maceta: cuándo trasplantar | TierraExacta',
  description: 'Qué significa ver raíces por los agujeros de drenaje, cómo comprobar un cepellón congestionado y elegir una maceta mayor sin excederse.',
  schema: articleSchema('Raíces saliendo por debajo de la maceta: ¿hay que trasplantar?', 'Guía para comprobar si una planta está congestionada y necesita trasplante.', 'cuidados/raices-salen-maceta'),
  content: `${careCrumbs('Raíces fuera de la maceta', 'cuidados/raices-salen-maceta/')} ${hero('Comprueba el cepellón', 'Raíces saliendo por debajo de la maceta: ¿hay que trasplantar?', 'Las raíces visibles son una señal útil, pero la mejor comprobación es observar el cepellón y cómo se comporta el agua.', `${button('litros-maceta/', 'Calcular litros de la nueva maceta')}`, false)}
    <article class="care-guide"><section><h2>Qué buscar</h2><p>Si muchas raíces rodean el exterior del cepellón, el crecimiento se ha ralentizado o el sustrato se seca anormalmente rápido, es razonable valorar un trasplante.</p></section><section><h2>No saltes a una maceta enorme</h2><p>Una cantidad excesiva de sustrato alrededor de un cepellón pequeño puede mantenerse húmeda durante demasiado tiempo. Un aumento moderado de tamaño permite ganar espacio sin multiplicar innecesariamente el volumen húmedo.</p></section><section><h2>Mide antes de comprar tierra</h2><p>Calcula el volumen interior de la nueva maceta y descuenta el volumen aproximado que ya ocupa el cepellón. Así puedes comprar una cantidad de sustrato más realista.</p></section></article>
    ${relatedProducts('repot')}
    ${sourceSection([sourceLink(sources.rhsRepot, 'RHS: señales de raíces congestionadas'), sourceLink(sources.pennRepot, 'Penn State Extension: cuándo trasplantar'), sourceLink(sources.illinoisStart, 'Illinois Extension: evitar macetas demasiado grandes')])}`
};

export const carePages = [hub, diagnostic, wiltAfterTransplant, yellowLeaves, overwatering, poorDrainage, rootsOut];
