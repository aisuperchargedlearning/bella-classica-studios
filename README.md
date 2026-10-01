# Bella Classica Studios

React + TypeScript website built with Vite, ready for a GitHub-connected AWS Amplify deployment.

The opening uses the supplied brass race-car identity, followed by The Ferrari Accord, part of the Bella Classica Series. Chapter One has separate narration and music players. Starting either pauses the other without losing its position. Each player has seeking, volume, mute, and real duration; narration also offers playback speed. Nothing autoplays.

## Run locally

Use Node.js 24 (specified in `.nvmrc`).

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To produce and preview the production build:

```sh
npm run build
npm run preview
```

`npm run build` first checks TypeScript, then writes the deployable site to `dist/`.

## Edit the chapter and ImageKit media

Edit `src/content/chapter-one.json`. Titles, the introduction, both audio URLs, and all chapter images live here. No private ImageKit key is needed to display publicly accessible media.

The current narration is `Ch1fullaudio1.mp3`. The song is **Let the Bells Be Late**. Both use your supplied ImageKit URLs.

Optional images are empty initially, so visitors see a complete page without placeholder artwork. To add a lead image, replace `"leadImage": null` with an object:

```json
"leadImage": {
  "src": "YOUR_PUBLIC_IMAGEKIT_IMAGE_URL",
  "alt": "A clear description of what the image shows",
  "caption": "Your caption",
  "credit": "Your image credit"
}
```

Add as many images as you like to the `images` array:

```json
"images": [
  {
    "src": "YOUR_PUBLIC_IMAGEKIT_IMAGE_URL",
    "alt": "A clear description of the first image",
    "caption": "Your caption",
    "credit": "Your image credit"
  },
  {
    "src": "ANOTHER_PUBLIC_IMAGEKIT_IMAGE_URL",
    "alt": "A clear description of the next image"
  }
]
```

`src` and `alt` are required; `caption` and `credit` are optional. Keep JSON valid: quote property names and strings, and avoid trailing commas. The gallery appears automatically when images are present, with responsive thumbnails and a keyboard-accessible enlarged view. Escape closes the enlarged view and returns focus to the image button. Images are browsed manually and do not change with narration.

`chapterTitle` is deliberately empty until you supply the actual chapter title. Studio copy and the hero URL live in `src/content/studio.json`.

### Move the emblem to ImageKit

The preview bundles `public/assets/bella-classica-hero.webp` because no public ImageKit URL for the emblem has been supplied. Upload that asset to your ImageKit account, then replace `heroImage` in `src/content/studio.json` with its public HTTPS URL. Audio and any chapter images already load directly from ImageKit. You can remove the bundled emblem once the hosted version is working.

### Emblem correction

The original supplied emblem says **Bella Classico**. A single built-in ImageGen edit corrected its name to **Bella Classica**, retaining **STUDIOS**, the brass reel, race car number 20, background, and lighting. The original source file was not modified. The corrected asset is supplied in this project's `public/assets/` directory as a compressed WebP.

Final edit prompt: “Change only ‘Bella Classico’ to ‘Bella Classica’; preserve STUDIOS, gold serif styling, brass film-reel emblem, race car number 20, background, lighting, textures, reflections, composition, and proportions.”

## GitHub and AWS Amplify

Intended repository: [aisuperchargedlearning/bella-classica-studios](https://github.com/aisuperchargedlearning/bella-classica-studios). The first version is prepared on `codex/studio-first-version` for review before merging into the deployment branch.

1. Put the contents of this project folder in your intended GitHub repository, including `package-lock.json`, `amplify.yml`, source, and public assets. Do not commit `node_modules/` or `dist/`.
2. In AWS Amplify Hosting, connect the GitHub repository and select the branch to deploy. If you already have a connected repository, merge or push the project into that repository instead of creating another Amplify app.
3. Keep this project at the repository root. The included `amplify.yml` uses Node.js 24, runs `npm ci` and `npm run build`, and publishes `dist/`.
4. Keep automatic branch builds enabled. Later code or content changes committed to that branch will rebuild the site.

No backend, AWS SDK, secret, or environment variable is required for this version. It has one page with in-page navigation, so client-side route rewrites are unnecessary.

If integrating into an existing project or monorepo, adapt its existing configuration rather than replacing it; Amplify may need an app-root setting for a subfolder.

Official references: [Vite setup](https://vite.dev/guide/) and [AWS Amplify build specification](https://docs.aws.amazon.com/amplify/latest/userguide/yml-specification-syntax.html).

## Presentation and accessibility

- Style-guide colors: ivory `#F3EFE6`, charcoal `#1A1A18`, oxblood `#6A2424`, brass `#A78952`, slate `#62676A`.
- Cormorant Garamond for display type; Inter for body and controls. Font files are bundled locally, with system fallbacks.
- The opening animation settles after about three seconds; it never blocks scrolling. Reduced-motion preferences disable the animation.
- Accessible audio labels, keyboard-operated sliders, visible focus, a skip link, native modal focus management, and no sound autoplay.
- Failed audio includes a retry through the play button and a direct file link; unavailable gallery images show a readable fallback.

## Current scope

This is the first studio page and first chapter experience. The introduction and studio statement are draft editorial copy based on your style guide, not invented novel content. There is no chapter transcript or synchronized artwork yet. Add a transcript when available to make the narration accessible to visitors who cannot hear it.

The intended GitHub repository is listed above. The Amplify app and ImageKit upload for the emblem still need to be connected. The supplied configuration is ready for Amplify deployment.
