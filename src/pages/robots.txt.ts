import type { APIRoute } from 'astro';
import { site } from '../data/site.mjs';

/** robots.txt généré au build : le domaine vient de src/data/site.mjs. */
export const GET: APIRoute = ({ site: configured }) => {
  const origin = (configured ?? new URL(site.url)).origin;
  return new Response(
    `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap-index.xml
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
  );
};
