import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const htmlFiles = await walk(dist, '.html');
const publicPaths = new Set((await walk(dist)).map((file) => `/${path.relative(dist, file).replaceAll('\\', '/')}`));
const failures = [];
const analyticsId = 'G-F721EVSWRC';
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const rel = path.relative(dist, file);
  if ((html.match(/<h1\b/g) || []).length !== 1) failures.push(`${rel}: debe contener un H1`);
  for (const required of ['<title>', 'name="description"', 'rel="canonical"', 'application/ld+json']) if (!html.includes(required)) failures.push(`${rel}: falta ${required}`);
  if (!html.includes(analyticsId)) failures.push(`${rel}: falta el identificador de Analytics de TierraExacta`);
  if (!html.includes('data-analytics-consent')) failures.push(`${rel}: falta el control de consentimiento de Analytics`);
  if (!html.includes('data-site-analytics')) failures.push(`${rel}: falta el cargador diferido de Analytics`);
  if (html.includes('G-EL1YW63SXD')) failures.push(`${rel}: conserva por error la etiqueta de HornoExacto`);
  for (const match of html.matchAll(/(?:href|src)="(\/tierra-exacta\/[^"#?]*)/g)) {
    let target = match[1].replace('/tierra-exacta', '') || '/index.html';
    if (target.endsWith('/')) target += 'index.html';
    if (!publicPaths.has(target)) failures.push(`${rel}: referencia local ausente ${match[1]}`);
  }
  for (const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(script[1]); } catch { failures.push(`${rel}: JSON-LD no válido`); }
  }
  validateInlineScripts(html, rel, failures);
}
const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
for (const required of ['litros-maceta/', 'jardinera-bancal/', 'sacos-sustrato/', 'mezcla-sustrato/']) if (!sitemap.includes(required)) failures.push(`sitemap: falta ${required}`);
if (sitemap.includes('404')) failures.push('sitemap: contiene una ruta no indexable');
const privacy=await readFile(path.join(dist,'privacidad','index.html'),'utf8');
if(privacy.includes('Esta versión no instala Google Analytics'))failures.push('privacidad: afirma erróneamente que no existe Google Analytics');
if(!privacy.includes('Google Analytics solo se carga después de que aceptes la analítica'))failures.push('privacidad: falta explicación del consentimiento de Analytics');
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; } else console.log(`Checked ${htmlFiles.length} HTML files, inline JavaScript, Analytics consent/privacy, local references, JSON-LD and sitemap.`);
function validateInlineScripts(html, rel, failures) { for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) { const attrs=match[1]||''; if (/\bsrc\s*=/i.test(attrs)) continue; const type=(attrs.match(/\btype=["']([^"']+)["']/i)?.[1]||'').toLowerCase(); if(type&&!['text/javascript','application/javascript'].includes(type))continue; try{new Function(match[2]);}catch(error){failures.push(`${rel}: JavaScript inline no válido (${error.message})`);} } }
async function walk(directory, extension = null) {
  const files = [];
  for (const name of await readdir(directory)) {
    const full = path.join(directory, name);
    if ((await stat(full)).isDirectory()) files.push(...await walk(full, extension));
    else if (!extension || full.endsWith(extension)) files.push(full);
  }
  return files;
}
