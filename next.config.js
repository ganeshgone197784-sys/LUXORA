// GitHub Actions sets GITHUB_ACTIONS=true automatically.
//  - On GitHub Pages: static export under /LUXORA
//  - On Vercel / Replit / local: normal Next.js (no prefix), so backend routes work later
const onGithub = process.env.GITHUB_ACTIONS === 'true';
const base = onGithub ? '/LUXORA' : '';

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  ...(onGithub ? { output: 'export', trailingSlash: true } : {}),
  basePath: base,
  assetPrefix: base,
  images: { unoptimized: true },
  // lib/asset.ts reads this to prefix logo, video and images in /public
  env: { NEXT_PUBLIC_BASE_PATH: base },
};
