const numberFrom = (value) => Number(String(value).trim().replace(',', '.'));

export function positive(value, label = 'El valor') {
  const number = numberFrom(value);
  if (!Number.isFinite(number) || number <= 0) throw new Error(`${label} debe ser mayor que cero.`);
  return number;
}

export function nonNegative(value, label = 'El valor') {
  const number = numberFrom(value);
  if (!Number.isFinite(number) || number < 0) throw new Error(`${label} no puede ser negativo.`);
  return number;
}

function quantity(value) {
  const count = positive(value, 'La cantidad');
  if (!Number.isInteger(count)) throw new Error('La cantidad debe ser un número entero.');
  if (count > 10000) throw new Error('La cantidad máxima es 10.000 recipientes.');
  return count;
}

export function roundContainer({ shape = 'frustum', topDiameter, bottomDiameter, height, freeboard = 0, count = 1, deductions = 0 }) {
  const top = positive(topDiameter, 'El diámetro superior');
  const bottom = shape === 'cylinder' ? top : positive(bottomDiameter, 'El diámetro inferior');
  const innerHeight = positive(height, 'La altura interior');
  const emptyEdge = nonNegative(freeboard, 'El borde sin llenar');
  if (emptyEdge >= innerHeight) throw new Error('El borde sin llenar debe ser menor que la altura interior.');
  const usableHeight = innerHeight - emptyEdge;
  const topRadius = top / 2;
  const bottomRadius = bottom / 2;
  const grossEach = Math.PI * usableHeight * (topRadius ** 2 + topRadius * bottomRadius + bottomRadius ** 2) / 3 / 1000;
  const deductionEach = nonNegative(deductions, 'Las deducciones');
  if (deductionEach >= grossEach) throw new Error('Las deducciones deben ser menores que el volumen calculado.');
  const each = grossEach - deductionEach;
  const qty = quantity(count);
  return { shape, usableHeight, grossEach, deductionEach, each, count: qty, total: each * qty };
}

export function rectangularContainer({ length, width, height, freeboard = 0, count = 1, deductions = 0 }) {
  const insideLength = positive(length, 'El largo interior');
  const insideWidth = positive(width, 'El ancho interior');
  const innerHeight = positive(height, 'La altura interior');
  const emptyEdge = nonNegative(freeboard, 'El borde sin llenar');
  if (emptyEdge >= innerHeight) throw new Error('El borde sin llenar debe ser menor que la altura interior.');
  const usableHeight = innerHeight - emptyEdge;
  const grossEach = insideLength * insideWidth * usableHeight / 1000;
  const deductionEach = nonNegative(deductions, 'Las deducciones');
  if (deductionEach >= grossEach) throw new Error('Las deducciones deben ser menores que el volumen calculado.');
  const each = grossEach - deductionEach;
  const qty = quantity(count);
  return { usableHeight, grossEach, deductionEach, each, count: qty, total: each * qty };
}

export function substrateBags({ requiredLitres, reserve = 10, bagSize, price = 0 }) {
  const needed = positive(requiredLitres, 'Los litros necesarios');
  const margin = nonNegative(reserve, 'El margen');
  if (margin > 100) throw new Error('El margen no puede superar el 100 %.');
  const size = positive(bagSize, 'El tamaño del saco');
  const unitPrice = nonNegative(price, 'El precio');
  const target = needed * (1 + margin / 100);
  const bags = Math.ceil(target / size);
  const purchased = bags * size;
  return { needed, reserve: margin, target, bagSize: size, bags, purchased, leftover: purchased - target, cost: bags * unitPrice };
}

export function substrateMix({ totalLitres, components }) {
  const total = positive(totalLitres, 'El volumen total');
  if (!Array.isArray(components) || components.length < 2) throw new Error('Añade al menos dos componentes.');
  const parsed = components.map(({ name, percentage }, index) => ({
    name: String(name || `Componente ${index + 1}`).trim(),
    percentage: nonNegative(percentage, `El porcentaje de ${name || `componente ${index + 1}`}`)
  }));
  const sum = parsed.reduce((value, component) => value + component.percentage, 0);
  if (Math.abs(sum - 100) > 0.001) throw new Error(`Los porcentajes suman ${sum.toLocaleString('es-ES')} %. Deben sumar 100 %.`);
  return { total, components: parsed.map((component) => ({ ...component, litres: total * component.percentage / 100 })) };
}
