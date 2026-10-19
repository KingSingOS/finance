import assert from 'node:assert/strict';
import fs from 'node:fs';
function externalAutoLoads(html) {
 const tags=html.match(/<(?:link|script|img|iframe)\b[^>]*>/gi)??[];
 return tags.filter(tag=>{
  if(/^<link/i.test(tag)&&!(/rel=["'][^"']*(?:icon|manifest|stylesheet|preload|prefetch|preconnect|dns-prefetch)/i.test(tag)))return false;
  return /(?:src|href)\s*=\s*["'](?:https?:)?\/\//i.test(tag);
 });
}
const html=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
assert.equal(externalAutoLoads('<link rel="icon" href="https://example.invalid/favicon.svg">').length,1,'Regression detector must reject inherited remote icons');
assert.equal(externalAutoLoads('<script src="https://example.invalid/app.js"></script>').length,1,'Regression detector must reject remote scripts');
assert.equal(externalAutoLoads(html).length,0,'Document shell must not auto-load external resources');
console.log('PASS: document shell contains no external auto-loading resources; icon/script regression probes verified');
