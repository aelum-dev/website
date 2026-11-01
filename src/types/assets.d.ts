// Astro's own types cover images (`astro:assets`) but not every asset a
// stylesheet can reference. This shim is what lets Layout.astro import the exact
// woff2 cuts base.css loads, so the <link rel="preload"> it emits carries the
// same build-time (content-hashed) URL the CSS will use — not a hand-written
// path that goes stale the next time a font is rebuilt.
declare module "*.woff2" {
  const url: string;
  export default url;
}
