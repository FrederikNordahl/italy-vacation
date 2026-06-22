# Tuscany Vacation Planner 2026

A collaborative vacation planning app for our Tuscany trip (Jun 27 – Jul 4, 2026). Built with Nuxt 4, Nuxt UI v4, Prisma, PostgreSQL, and Vercel Blob.

## Features

- **Board view** — Kanban-style columns for each vacation day plus an unscheduled backlog
- **Calendar view** — Month grid with activities on scheduled dates
- **Activity details** — Route-driven modal at `/activity/[id]` with markdown, gallery, votes, and comments
- **Ranking & itinerary** — Vote-based rankings and day-by-day itinerary
- **Compare drawer** — Side-by-side comparison of up to 3 activities
- **Identity picker** — 8 participants stored in localStorage (no auth); Frederik has admin UI access
- **Admin tools** — Create/edit activities, upload images to Vercel Blob, manage links

## Tech Stack

- Nuxt 4 + Nuxt UI v4 + Tailwind CSS v4
- Prisma + PostgreSQL (`@prisma/adapter-pg`)
- Vercel Blob for image uploads
- vue-draggable-plus for board drag-and-drop
- Zod validation on all API routes

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL database

### Setup

```bash
# Pull env from Vercel (or copy .env.example manually)
vercel env pull .env.local

npm install
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed 5 Tuscany activities |
| `npm run db:push` | Push schema without migration |
| `npm run db:studio` | Open Prisma Studio |

## Vercel Deployment

1. Connect the repo to Vercel
2. Set environment variables:
   - `DATABASE_URL` — PostgreSQL connection string (e.g. Neon, Supabase)
   - `BLOB_READ_WRITE_TOKEN` — Vercel Blob read/write token
3. Run `npx prisma migrate deploy` against production DB (or add as build step)
4. Deploy — Nitro preset `vercel` uses Node runtime (required for Prisma)

## Vacation Details

- **Dates:** June 27 – July 4, 2026
- **Home base:** Molino Della Carpinese, Tuscany
- **Highlight:** Siena + Palio on July 2

## Identities

Frederik (admin), Søren, Marie, Peter, Anna, Lars, Emma, Jonas — selected on first visit, stored in `localStorage`.
