// Static export for GitHub Pages (repo name: LUXORA).
// Production build: site lives at /LUXORA. Local dev (Replit): no prefix.
const isProd = process.env.NODE_ENV === 'production';
const base = isProd ? '/LUXORA' : '';

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'export',
  basePath: base,
  assetPrefix: base,
  trailingSlash: true,
  images: { unoptimized: true },
  // lib/asset.ts reads this to prefix logo, video and images in /public
  env: { NEXT_PUBLIC_BASE_PATH: base },
};
