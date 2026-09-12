const finding = (id, title, summary, actions, productIntent = null, priority = 50) => ({ id, title, summary, actions, productIntent, priority });

export function diagnosePlant(input = {}) {
  const symptom = String(input.symptom || 'unknown');
  const moisture = String(input.moisture || 'unknown');
  const drainage = String(input.drainage || 'unknown');
  const recentRepot = Boolean(input.recentRepot);
  const rootsVisible = Boolean(input.rootsVisible);
  const recentMove = Boolean(input.recentMove);
  const results = [];

  if ((moisture === 'wet' && ['wilt', 'yellow', 'drop'].includes(symptom)) || drainage === 'none' || drainage === 'slow') {
    results.push(finding(
      'excess-water-drainage',
      'Revisa primero exceso de agua y drenaje',
      'Una planta puede marchitarse aunque el sustrato esté muy húmedo. El exceso de agua y un drenaje deficiente reducen el aire disponible en la zona de raíces y pueden causar amarilleo, caída o colapso.',
      ['No vuelvas a regar por calendario: comprueba la humedad unos centímetros por debajo de la superficie.', 'Vacía el agua acumulada en cubremacetas o platos.', 'Si la maceta no tiene salida de agua, considera pasar la planta a un recipiente con drenaje adecuado.', 'Si el sustrato permanece apelmazado o saturado durante demasiado tiempo, valora renovarlo por uno apropiado para la especie y con mejor aireación.'],
      'drainage',
      100
    ));
  }

  if (moisture === 'dry' && ['wilt', 'yellow', 'brown', 'drop'].includes(symptom)) {
    results.push(finding(
      'dry-substrate',
      'El sustrato seco puede explicar el marchitamiento',
      'El marchitamiento y los bordes secos pueden aparecer cuando la planta no dispone de suficiente agua. La superficie sola no siempre basta para saberlo.',
      ['Comprueba la humedad a cierta profundidad antes de regar.', 'Riega de forma suficiente para humedecer el cepellón y permite que el exceso salga por los agujeros de drenaje.', 'Observa cuánto tarda en volver a secarse antes de fijar una nueva frecuencia de riego.'],
      'water-management',
      95
    ));
  }

  if (recentRepot && ['wilt', 'drop', 'yellow'].includes(symptom)) {
    results.push(finding(
      'transplant-stress',
      'Puede haber estrés después del trasplante',
      'Al trasplantar se pueden alterar raíces finas y durante un tiempo la planta puede absorber menos agua de la que pierde por las hojas. Eso no significa automáticamente que necesite más riego.',
      ['Mantén unas condiciones de luz y temperatura estables mientras se adapta.', 'Comprueba la humedad real antes de volver a regar.', 'Evita cambios adicionales innecesarios mientras observas la recuperación.', 'Si acabas de trasplantar, confirma que el recipiente drena y que el cepellón quedó en contacto con el nuevo sustrato.'],
      'repot',
      90
    ));
  }

  if (rootsVisible) {
    results.push(finding(
      'rootbound',
      'Comprueba si las raíces están congestionadas',
      'Raíces que salen por los agujeros pueden indicar que el espacio disponible se ha quedado corto. Un cepellón muy congestionado también puede dificultar el drenaje y el reparto del agua.',
      ['Saca el cepellón con cuidado y comprueba si hay una masa densa de raíces rodeando el exterior.', 'Si necesita más espacio, sube solo a una maceta algo mayor en vez de elegir un recipiente desproporcionadamente grande.', 'Renueva parte del sustrato con una mezcla adecuada a la planta y mantén salida de agua.'],
      'repot',
      85
    ));
  }

  if (recentMove && ['yellow', 'drop', 'wilt'].includes(symptom)) {
    results.push(finding(
      'environment-change',
      'Un cambio reciente de ambiente también puede influir',
      'Cambios bruscos de luz, temperatura, humedad ambiental o ubicación pueden provocar amarilleo o caída de hojas mientras la planta se aclimata.',
      ['Evita moverla repetidamente mientras evalúas el problema.', 'Comprueba que la nueva ubicación se ajuste a las necesidades de luz de la especie.', 'Revisa el riego porque una nueva ubicación puede hacer que el sustrato se seque a otra velocidad.'],
      null,
      70
    ));
  }

  if (symptom === 'yellow' && moisture !== 'wet') {
    results.push(finding(
      'yellow-multiple-causes',
      'Las hojas amarillas no tienen una única causa',
      'El amarilleo puede relacionarse con agua, drenaje, luz, temperatura, raíces congestionadas o disponibilidad de nutrientes. Conviene descartar primero las condiciones de cultivo antes de añadir fertilizante.',
      ['Comprueba humedad y drenaje.', 'Revisa si hubo un cambio reciente de luz o temperatura.', 'Observa si el amarilleo afecta a hojas viejas, nuevas o a toda la planta.', 'Inspecciona raíces y señales visibles de plagas antes de decidir una corrección.'],
      null,
      60
    ));
  }

  if (!results.length) {
    results.push(finding(
      'general-check',
      'Empieza por las condiciones básicas',
      'Con los datos indicados no hay una causa dominante. Marchitamiento, amarilleo y caída de hojas pueden compartir varias causas.',
      ['Comprueba humedad a cierta profundidad.', 'Confirma que el recipiente drena.', 'Revisa cambios recientes de luz, temperatura o ubicación.', 'Inspecciona hojas, tallos y raíces antes de aplicar tratamientos.'],
      null,
      40
    ));
  }

  return results.sort((a, b) => b.priority - a.priority);
}
