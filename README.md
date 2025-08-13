# Vercel ToDo App (Next.js)

A simple, local-first ToDo app built with **Next.js App Router + TypeScript**.  
No backend required — tasks are stored in **localStorage**. Perfect for quick demos and deploying to **Vercel**.

## Features
- Add tasks with optional due date
- Mark complete / undo
- Edit title inline
- Delete tasks
- Filter by All / Active / Done
- Search
- Persisted in `localStorage`

## Tech
- Next.js (App Router)
- React 18 + TypeScript
- Zero backend; fully static

## Run locally
```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build
```bash
npm run build
npm start
```

## Deploy to Vercel
1. Push this repo to GitHub (or import the ZIP).
2. Go to **vercel.com** → **New Project** → **Import Git Repository**.
3. Framework should auto-detect **Next.js**.
4. No special env vars needed. Click **Deploy**.

> Tip: Because this app is static and uses client components only, the default Vercel configuration works out of the box.

## Project Structure
```
app/
  layout.tsx
  page.tsx
  globals.css
components/
  TodoApp.tsx
public/
package.json
tsconfig.json
next.config.mjs
```

## License
MIT
