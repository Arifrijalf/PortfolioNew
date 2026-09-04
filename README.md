# Portfolio — Arif Rijal Fadhilah

Personal portfolio web application for Arif Rijal Fadhilah, an Electronics Engineering student specializing in embedded systems, firmware, and IoT telemetry.

Live site: [arifrijalfadhilah.fun](https://arifrijalfadhilah.fun)

## Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide React
- **Build Tool:** Vite
- **UI Components:** Radix UI, Sonner (toasts)
- **Deployment:** Cloudflare Pages

## Project Structure

```text
├── client/          # Frontend source code (React + Tailwind)
│   ├── public/      # Static assets (images, favicon, headers)
│   └── src/         # Components, pages, hooks, contexts
├── shared/          # Shared TypeScript types
├── patches/         # Local pnpm package patches
└── vite.config.ts   # Vite build configuration
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm check
```

## License

[MIT](LICENSE) © 2026 Arif Rijal Fadhilah
