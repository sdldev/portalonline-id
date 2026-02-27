# Portal Online ID

This is a modern web project built with **Astro**, configured for Server-Side Rendering (SSR) via Cloudflare.

## 🚀 Features & Configuration

- **Framework**: Astro 5.18.0
- **Package Manager**: Bun
- **Output Mode**: Server (SSR)
- **Deployment Adapter**: Cloudflare (`@astrojs/cloudflare`)
- **Integrations**:
  - MDX (`@astrojs/mdx`) for interactive markdown components.
  - Sitemap (`@astrojs/sitemap`) for SEO.
  - Robots.txt (`astro-robots-txt`) for crawler management.

## 📁 Project Structure

```text
/
├── public/           # Static assets (images, fonts, etc.)
├── src/              # Astro source code (pages, components, etc.)
├── dist/             # Build output
├── astro.config.mjs  # Astro configuration and integrations
├── wrangler.jsonc    # Cloudflare Wrangler configuration
├── Dockerfile        # Containerization instructions
└── package.json      # Project dependencies and scripts
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal using `bun`:

| Command | Action |
| :--- | :--- |
| `bun install` | Installs dependencies |
| `bun dev` | Starts local dev server at `localhost:4321` |
| `bun build` | Build your production site to `./dist/` |
| `bun preview` | Preview your build locally, before deploying |
| `bun astro ...` | Run CLI commands like `astro add`, `astro check` |

## ☁️ Deployment

### Cloudflare (Primary)
This project is deeply integrated with Cloudflare. The `wrangler.jsonc` is configured for deployment with the name `landing`.
```sh
bun run build
# Deploy to Cloudflare using Wrangler
bunx wrangler deploy
```

### Docker
A `Dockerfile` is included for containerized environments. *Note: As the project uses `output: 'server'` for Cloudflare, make sure the Docker environment (which uses nginx to serve static files) fully suits the Astro SSR requirements if migrating away from Cloudflare.*
```sh
docker build -t portalonline-id .
docker run -p 8080:80 portalonline-id
```
