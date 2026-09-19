# GitHub Pages Deployment QA

## Deployment

- Repository: `https://github.com/somatic-health/life-memory-detective`
- Base sealed commit: `d093823a53a4d9102b7caf180fbd40aba11f7f73`
- Sealed tag: `v1.0.1` (unchanged; still points to the base sealed commit)
- Deployment commit: `e2cf1a0f0437c46e163b13ea483c3e3713b62913`
- Workflow: `Deploy GitHub Pages`
- Successful workflow run: `35436934619`
- Pages source: GitHub Actions (`build_type: workflow`), `main:/`
- Pages environment: `github-pages`
- Production URL: `https://somatic-health.github.io/life-memory-detective/`

## Build and path verification

- Framework: React + TypeScript + Vite
- Package manager: Bun (existing `bun.lock` retained; workflow uses `bun install --no-save` because the sealed lockfile is legacy Bun lockfile version 2)
- Pages build config: `vite.pages.config.ts`
- Pages base path: `/life-memory-detective/`
- Build: PASS
- Output: `index.html`, JavaScript, CSS, and 24 question PNGs present
- Question image path transform: Pages-only build transform uses Vite `BASE_URL`; sealed source data and `vite.offline.config.ts` were not changed

## Production URL checks

- Page HTTP: 200
- Title: `生活記憶偵探 - 仔細看看，剛剛哪裡不一樣？`
- JavaScript: 200
- CSS: 200
- Question images: 24/24 HTTP 200
- Same-site static assets: PASS
- External image/API/backend/CDN dependency: none observed
- Existing Google Fonts links remain as optional typography enhancement from the sealed source; the game remains functional without them

## Gameplay QA

- Easy: 4/4 PASS
- Normal: 4/4 PASS
- Hard: 4/4 PASS
- Hard answers: 8/8 PASS
- `hard_02`: PASS; first answer displayed `很好，還有 1 個地方不一樣。`, first red circle persisted, second answer completed the question
- Red circle feedback: PASS
- Success sound path: PASS (existing offline Web Audio implementation)
- Pre-answer hotspot hover leakage: PASS (no visible answer overlays or answer borders observed)
- Result pages and difficulty switching: PASS

## Responsive and runtime QA

- `390x844`: PASS; home controls rendered, no horizontal overflow (`scrollWidth` equals `clientWidth`)
- `1920x1080`: PASS; home controls rendered, no horizontal overflow
- Browser console errors/warnings: 0
- Runtime uncaught exception: none observed
- Gameplay/UI source changes: none
- Standalone Offline build/configuration: unchanged

## Release protection

- `v1.0.1` tag: unchanged
- `v1.0.1` Release: unchanged
- Release assets: unchanged
