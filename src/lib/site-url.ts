/**
 * Explicit auth origin, shared by signup and password recovery.
 * NEXT_PUBLIC_* is inlined into the browser bundle at build time: never infer
 * this from the browser/request host or VERCEL_URL (deployment-specific).
 */
export function getSiteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl?.trim()) {
    throw new Error('Missing NEXT_PUBLIC_SITE_URL. Set the canonical app origin and rebuild the app.');
  }

  let url: URL;
  try {
    url = new URL(configuredUrl);
  } catch {
    throw new Error('Invalid NEXT_PUBLIC_SITE_URL. Set an absolute HTTP(S) app origin.');
  }

  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '[::1]';
  if (url.username || url.password || (url.protocol !== 'https:' && !(isLocal && url.protocol === 'http:'))) {
    throw new Error('Invalid NEXT_PUBLIC_SITE_URL. Use HTTPS (HTTP is allowed only for localhost).');
  }

  return url.origin;
}
