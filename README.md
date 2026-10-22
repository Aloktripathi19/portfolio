# Alok Ram Tripathi — Portfolio

Personal portfolio built with **Next.js 15 (App Router)**, **Tailwind CSS v4** and **Motion**. The page is fully static, so it deploys to Vercel with no configuration.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Edit content

Everything on the page comes from [`lib/data.ts`](lib/data.ts): profile, stats, experience, featured work, projects, skills, certifications and education. The résumé PDF is served from `public/Alok_Ram_Tripathi_Resume.pdf`; replace that file to update the download.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. On [vercel.com/new](https://vercel.com/new), import the repo. Vercel detects Next.js automatically.
3. Optional: set the `NEXT_PUBLIC_SITE_URL` environment variable to your final domain so social previews use absolute URLs.

Or, from this folder: `npx vercel` (preview) then `npx vercel --prod`.

## Structure

```
app/          layout (fonts, SEO, JSON-LD), page, favicon, generated OG image
components/   one file per section, plus Preloader, Cursor, Marquee, Reveal helpers
lib/data.ts   all content
public/       résumé PDF
```
