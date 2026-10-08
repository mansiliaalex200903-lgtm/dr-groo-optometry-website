# Dr. Groo Optometry Website

Local 1:1 copy of [drelainamgroo.com](https://www.drelainamgroo.com/) for redesign work.

## Quick start

```bash
npm run dev
```

Open **http://localhost:3001**

## Folders

| Folder | Purpose |
|--------|---------|
| `live/` | Full mirrored live site (HTML, CSS, JS, images, fonts) — redesign from this |
| `_redesign-draft/` | Clean redesign sandbox (optional) |
| `scripts/` | `mirror-site.mjs` to refresh the live mirror |

## Refresh the mirror

```bash
npm run mirror
```

## Notes

- Same page names/paths as the live Weebly site (`index.html`, `our-practice.html`, etc.)
- Weebly CDN assets are localized under `live/cdn/`
- External widgets (appointment booking, online contact lenses, reviews) still load from their live hosts
