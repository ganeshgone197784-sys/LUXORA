// Adds the GitHub Pages base path (e.g. /my-repo) to files in /public.
export const asset = (path: string) => (process.env.NEXT_PUBLIC_BASE_PATH || '') + path;
