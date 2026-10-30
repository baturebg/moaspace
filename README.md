# moaspace
Social Networking platform

A React + Vite build of the Moa Space Figma designs, with light and dark themes.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

## Build

```bash
npm run build    # outputs to dist/
npm run lint
```

## Deploy

Netlify reads `netlify.toml`: it runs `npm run build`, publishes `dist/`, and serves
`index.html` for every route so React Router links work on refresh.
