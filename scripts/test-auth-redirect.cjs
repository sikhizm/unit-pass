// No test-runner dependency: node scripts/test-auth-redirect.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const source = fs.readFileSync('src/lib/site-url.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function siteUrl(value) {
  const context = {
    exports: {}, URL,
    process: { env: { NEXT_PUBLIC_SITE_URL: value, VERCEL_URL: 'unit-pass-generated.vercel.app' } },
    window: { location: { origin: 'https://unit-pass-generated.vercel.app' } },
  };
  vm.runInNewContext(compiled, context);
  return context.exports.getSiteUrl();
}
const production = 'https://unit-pass.vercel.app';
for (const value of [production, `${production}/`, `${production}/ignored?query=1#hash`]) {
  assert.equal(siteUrl(value), production);
}
for (const value of [undefined, '', '   ']) assert.throws(() => siteUrl(value), /Missing NEXT_PUBLIC_SITE_URL/);
for (const value of ['invalid', '//example.com', 'javascript:alert(1)', 'http://example.com', 'https://user:password@example.com']) {
  assert.throws(() => siteUrl(value), /Invalid NEXT_PUBLIC_SITE_URL/);
}
assert.equal(siteUrl('http://localhost:3000/'), 'http://localhost:3000');
assert.equal(siteUrl('https://explicit-preview.example.com/'), 'https://explicit-preview.example.com');
for (const [file, option, next] of [
  ['sign-up/sign-up-form.tsx', 'emailRedirectTo', '/dashboard'],
  ['forgot-password/forgot-password-form.tsx', 'redirectTo', '/auth/reset-password'],
]) {
  const form = fs.readFileSync(`src/app/auth/${file}`, 'utf8');
  const match = form.match(new RegExp(option + ': `([^`]+)`'));
  assert.ok(match, `${file}: redirect option exists`);
  assert.equal(match[1].replace('${getSiteUrl()}', siteUrl(production)), `${production}/auth/callback?next=${next}`);
  assert.ok(!form.includes('window.location.origin'), `${file}: no host fallback`);
}
console.log('PASS: explicit production/local/preview origins, normalization, invalid/missing configuration, signup and recovery destinations');
