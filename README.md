# Aetheryn Technology

**Premium B2B fintech engineering, enterprise IT architecture and custom software consultancy.**

Live site: <https://aetheryntechnology.com>

A fast, accessible, single-page marketing site for Aetheryn Technology. It is plain static files (no build step, no framework, no package manager), so it deploys as-is to GitHub Pages, Vercel or Netlify.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Repository structure](#repository-structure)
3. [Architecture](#architecture)
4. [Feature components](#feature-components)
5. [SEO and structured data](#seo-and-structured-data)
6. [Design system](#design-system)
7. [Run locally](#run-locally)
8. [Deploy to GitHub Pages](#deploy-to-github-pages)
9. [Deploy to Vercel or Netlify](#deploy-to-vercel-or-netlify)
10. [Customisation](#customisation)
11. [Pre-launch checklist](#pre-launch-checklist)
12. [Credits and licences](#credits-and-licences)

---

## Tech stack

| Layer | Choice |
| --- | --- |
| Markup | Vanilla HTML5, semantic landmarks, one `<h1>` |
| Styling | Custom design-system CSS (`styles.css`) plus **Tailwind CSS via CDN** for utilities |
| Behaviour | Modular vanilla JavaScript (`script.js`), no dependencies |
| Fonts | Chakra Petch (display) and Metropolis (body), self-hosted `woff2` |
| Hosting | Any static host (GitHub Pages, Vercel, Netlify, Cloudflare Pages, S3) |

> **How Tailwind is used.** The visual theme is a hairline-grid "square" design system, written as hand-authored CSS in `styles.css`. Tailwind is loaded from its CDN with `preflight` **disabled**, so it adds utility classes (`m-0`, `text-dim`, `border-line`, and so on) without resetting the design system. Critical layout never depends on the CDN: `styles.css` carries fallbacks, so the page still renders correctly if the CDN is unreachable.

---

## Repository structure

```
aetheryn-technology/
├── index.html              Single-page site: head/SEO, all sections, JSON-LD
├── styles.css              Design tokens, hairline grid, components, responsive rules, @font-face
├── script.js               Menu, active-nav, hero pixel reveal, section reveal, contact form, year
├── robots.txt              Crawl rules + sitemap pointer
├── sitemap.xml             Single-URL sitemap
├── CNAME                   Custom domain for GitHub Pages (aetheryntechnology.com)
├── .nojekyll               Tells GitHub Pages to serve files as-is
├── README.md               This file
└── assets/
    ├── fonts/              Chakra Petch + Metropolis (woff2) and the OFL licence text
    └── images/
        ├── logo.svg                    Pixel-grid "A" mark (header, principle cards)
        ├── favicon.svg                 Same mark, used as the browser icon
        ├── apple-touch-icon.png        180x180 home-screen icon
        ├── og-image.png                1200x630 Open Graph / Twitter card image
        └── blueprints/                 Six square SVG reference-architecture illustrations
```

All paths in the HTML and CSS are relative (`./styles.css`, `./script.js`, `./assets/...`), so the site resolves correctly from a repository root, a sub-path, or a custom domain.

---

## Architecture

**Single page, section-per-concern.** `index.html` holds the whole site, in this order:

| # | Section | `id` | Purpose |
| --- | --- | --- | --- |
| 0 | Hero | `top` | H1, value proposition, primary calls to action |
| 1 | About | `about` | Positioning and capability statements |
| 2 | Services | `services` | The three core practices |
| 3 | Blueprints | `blueprints` | Six reference architectures (illustrative, not case studies) |
| 4 | Process | `process` | Discover, Design, Build, Operate |
| 5 | Industries | `industries` | Sector focus areas |
| 6 | Principles | `principles` | The engineering charter |
| 7 | Standards | `standards` | PCI DSS, SOC 2, ISO 27001, DORA and PSD2 alignment |
| 8 | Contact | `contact` | Enquiry form and contact details |

**CSS layering.** `styles.css` is organised into numbered blocks: fonts, tokens, base, layout and grid, header, buttons, hero, section heads, then one block per section, responsive rules, and motion. All colours, spacing and type sizes come from the `:root` tokens at the top. The "cells" pattern draws 1px hairlines using the grid gap colour, so no per-cell borders are needed.

**Responsive strategy.** Breakpoints at 1100px, 860px and 600px collapse the 5, 4 and 3-column grids to 2 and 1 columns, switch the header to the mobile menu at 860px, and hide the hero artwork on small screens. Spacing uses `clamp()` through the `--pad` token.

**JavaScript modules.** `script.js` is a single classic script (not an ES module, so it also works from `file://`) made of small, independent objects, each with an `init()` method:

| Module | Responsibility |
| --- | --- |
| `Menu` | Accessible mobile nav toggle, closes on link click, Escape and resize |
| `ActiveNav` | Highlights the current section link with `IntersectionObserver` (no scroll handler) |
| `Pixels` | Staggers the hero pixel-grid entrance (one-shot) |
| `Reveal` | One-time fade and slide-up of section heads |
| `ContactForm` | Native validation, honeypot, POST to endpoint or `mailto:` fallback |
| `Year` | Keeps the footer copyright year current |

---

## Feature components

- **Added:** blueprint category filter, capability explorer (tabs), technology-stack tabs, AI and automation section, engagement models, FAQ accordion with `FAQPage` schema, extended enquiry form (company, budget, timeline) and a back-to-top button.
- **Branding approach:** visible copy uses "we" and neutral wording. The full company name lives in `<title>`, meta and Open Graph tags, JSON-LD (`name`, `alternateName`), `alt`, `aria-label` and `title` attributes, plus the logo, footer and copyright.
- **Hairline-grid layout** with square tiles, bracketed section labels (`[01] About`) and zero border-radius.
- **Responsive header** with a full-height bordered nav on desktop and a toggle menu below 860px.
- **Accessible by default:** skip link, visible focus rings, `aria-current` on the active nav link, `aria-expanded` on the menu button, live-region form status, descriptive `alt` text on every image, and `prefers-reduced-motion` support.
- **Performance-minded:** flat colours with no blur, shadows or filters, `content-visibility: auto` on sections, lazy-loaded images, font preloads, and no continuous animation.
- **Contact form** with native validation and a hidden honeypot field. With no backend configured it opens the visitor's email app with the message prefilled. Set `data-endpoint` on the `<form>` to post JSON to Formspree, Netlify Forms, or your own API.

---

## SEO and structured data

Everything lives in the `<head>` of `index.html`:

- **Title** (58 characters): `Aetheryn Technology | Fintech Engineering & IT Consultancy`
- **Meta description** (157 characters), written for click-through.
- **Canonical:** `https://aetheryntechnology.com`
- **Open Graph:** `og:site_name`, `og:title`, `og:description`, `og:url`, `og:type`, `og:locale`, plus `og:image` with an absolute URL, dimensions and alt text.
- **Twitter/X Card:** `summary_large_image` with title, description, image and image alt.
- **Robots and authorship:** `robots`, `author` and `publisher` meta tags.
- **JSON-LD (`@graph`):** an `Organization` node (name, legal name, URL, logo, description, contact point, audience, `knowsAbout`, and an `OfferCatalog` of the three services) and a `WebSite` node that references the organisation as publisher.
- **Crawl files:** `robots.txt` and `sitemap.xml`.
- **Images:** every `<img>` has a descriptive `alt` that includes the company name in context. The pixel-grid hero graphic is exposed as `role="img"` with an `aria-label`.

After launch, validate with Google's [Rich Results Test](https://search.google.com/test/rich-results), the [Schema Markup Validator](https://validator.schema.org/), and the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

---

## Design system

Defined as CSS custom properties at the top of `styles.css`:

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#070708` | Page background |
| `--surface` / `--surface-2` | `#0e0e10` / `#161618` | Panels, inputs, hover |
| `--line` / `--line-strong` | `#26262a` / `#3a3a40` | Hairlines, borders |
| `--text` / `--muted` / `--dim` | `#f5f5f4` / `#a3a3ab` / `#71717a` | Text hierarchy |
| `--amber` | `#ff9f43` | Primary accent |
| `--ember` | `#ff6a3d` | Secondary accent |
| `--font-display` | Chakra Petch | Headings, nav, buttons |
| `--font-body` | Metropolis | Body copy |
| `--frame` | `1280px` | Maximum content width |

---

## Run locally

Any static server works. From the repository root:

```bash
# Python 3
python3 -m http.server 8080

# or Node
npx serve .
```

Then open <http://localhost:8080>. You can also open `index.html` directly in a browser.

---

## Deploy to GitHub Pages

### 1. Create the repository

Create an empty repository on GitHub (for example `aetheryn-technology`) with no README, `.gitignore` or licence, so the first push is clean.

### 2. Push the code

From the project folder:

```bash
git init
git add .
git commit -m "Initial commit: Aetheryn Technology website"
git branch -M main
git remote add origin https://github.com/<your-username>/aetheryn-technology.git
git push -u origin main
```

If you use the GitHub CLI, this does the same in one step:

```bash
gh repo create aetheryn-technology --public --source=. --remote=origin --push
```

### 3. Enable Pages

1. Open the repository on GitHub and go to **Settings, then Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Select branch **`main`** and folder **`/ (root)`**, then **Save**.
4. Wait about a minute. The site goes live at `https://<your-username>.github.io/aetheryn-technology/` and, once DNS is set, at `https://aetheryntechnology.com`.

The included `.nojekyll` file stops GitHub from running Jekyll over the files.

### 4. Point the custom domain

The repository already contains a `CNAME` file with `aetheryntechnology.com`. At your DNS provider, add:

| Type | Host | Value |
| --- | --- | --- |
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |
| `CNAME` | `www` | `<your-username>.github.io` |

Then in **Settings, then Pages, then Custom domain**, confirm `aetheryntechnology.com` and tick **Enforce HTTPS** once the certificate is issued (this can take up to an hour). DNS can take longer to propagate. Check GitHub's [custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) if the addresses have changed.

### 5. Ship updates

```bash
git add .
git commit -m "Describe your change"
git push
```

Pages redeploys automatically on every push to `main`.

> **Serving from a sub-path?** If you deploy at `https://<user>.github.io/<repo>/` without a custom domain, the relative asset paths work as-is, but the absolute URLs in the canonical, Open Graph, Twitter and JSON-LD tags will still point at `https://aetheryntechnology.com`. That is correct for production; just remember the social image will not resolve until the custom domain is live.

---

## Deploy to Vercel or Netlify

Both need zero configuration.

**Vercel:** import the GitHub repository, set **Framework Preset** to **Other**, leave build command and output directory empty, and deploy. Add `aetheryntechnology.com` under **Settings, then Domains**.

**Netlify:** choose **Add new site, then Import an existing project**, leave the build command empty and set the publish directory to `.` (the repository root). Add the domain under **Domain management**. For Netlify-hosted forms, add a hidden `form-name` field and `data-netlify="true"`, or set `data-endpoint` to a form service URL.

---

## Customisation

| To change | Edit |
| --- | --- |
| Colours, fonts, widths | `:root` tokens at the top of `styles.css` |
| Copy, sections, nav | `index.html` |
| Contact email | Search `contact@aetheryntechnology.com` in `index.html` (form `data-mailto`, contact list, JSON-LD) |
| Form delivery | `data-endpoint` attribute on `#contact-form` |
| Social card | Replace `assets/images/og-image.png` (keep 1200x630) |
| Sitemap date | `<lastmod>` in `sitemap.xml` |

**Moving off the Tailwind CDN.** The CDN build is convenient for zero-config deploys, but it compiles in the browser. For maximum performance, compile Tailwind at build time (Tailwind CLI), output a small CSS file, and remove the CDN `<script>` and the inline `tailwind.config` block from `index.html`. The design system in `styles.css` does not depend on it.

---

## Pre-launch checklist

- [ ] Confirm `contact@aetheryntechnology.com` exists and receives mail, or replace it everywhere.
- [ ] Connect a form endpoint (`data-endpoint`) if you do not want the `mailto:` fallback.
- [ ] Review the claims in the About stats (`3`, `6`, `100%`, `1`) and the "replies within one business day" line, and adjust to what you can stand behind.
- [ ] Add real social profile URLs to the JSON-LD `sameAs` array and footer once they exist.
- [ ] Add a postal address, phone number and founding date to the JSON-LD if you want them published.
- [ ] Add real case studies and client logos (with permission) when available; the Blueprints and Industries sections are deliberately framed as illustrative.
- [ ] Add a privacy policy page if you collect enquiries and operate in regulated jurisdictions.
- [ ] Submit `https://aetheryntechnology.com/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
- [ ] Run Lighthouse (Performance, Accessibility, SEO) and fix anything flagged for your final content.

---

## Credits and licences

- **Fonts:** Chakra Petch and Metropolis, both under the SIL Open Font License 1.1 (Chakra Petch licence text in `assets/fonts/OFL-ChakraPetch.txt`).
- **Design:** the visual system is derived from the supplied "Shevyra" square-theme template, rebranded for Aetheryn Technology. Team portraits from that template were intentionally **not** carried over.
- **Copyright:** (c) Aetheryn Technology. All rights reserved.
