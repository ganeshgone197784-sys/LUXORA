// Static export so the site can be hosted on GitHub Pages.
// NEXT_PUBLIC_BASE_PATH is set automatically by the GitHub workflow (e.g. /my-repo).
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  output: 'export',
  basePath: base,
  trailingSlash: true,
  images: { unoptimized: true },
};
