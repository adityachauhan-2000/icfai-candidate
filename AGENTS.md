<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:skyschool-agent-rules -->
# SkySchool Agent Rules
# rules
1. dont run npm run build
2. create reusable componet for simple understanding and use 
3. create utils file to import required methods
4. create api folder for api requests
5. use tailwind css
6. use axios for api requests
7. dont run npx biome check --write
## Before Writing Any Code
- Read `node_modules/next/dist/docs/01-app/` before using any Next.js API — this is Next.js 16 with breaking changes.
- Read the relevant existing file before editing it. Never modify code you haven't seen.
<!-- - Run `npx next build` after any change to verify the build passes before presenting results. -->

## Project Structure
- All user-facing pages live inside `src/app/(dashboard)/` and automatically inherit the sidebar + topbar layout.
- Route group `(dashboard)` is not a URL segment — routes are `/dashboard`, `/study-plan`, `/placement-prep`, etc.
- Shared UI components go in `src/components/`. No components folder inside `app/`.
- File-based routing only — no manual router configuration.
- Page files are always named `page.js`. Layout files are always named `layout.js`.

## Components
- Add `"use client"` at the top of any file that uses `useState`, `useEffect`, `useRef`, `useRouter`, `usePathname`, or any browser API.
- Server components (no directive) are the default — only opt into client when necessary.
- Keep components focused. If a component exceeds ~150 lines, split it.
- No anonymous default exports. Always name your default export function.

## Styling
- Use CSS custom properties from `globals.css` for all colors — never hardcode hex values like `#7c3aed` in JSX.
  - Correct: `style={{ color: "var(--accent)" }}`
  - Wrong: `style={{ color: "#7c3aed" }}`
- Exception: one-off decorative gradients or chart colors that have no semantic meaning in the design system.
- Use Tailwind v4 utility classes for spacing, layout, and typography (`px-4`, `flex`, `rounded-xl`, etc.).
- Use inline `style` props only for dynamic values or CSS variables.
- Do not use `@apply` — write utility classes directly in JSX.
- Tailwind config: this project uses `@import "tailwindcss"` in `globals.css` — there is no `tailwind.config.js`.

## Theme
- Background: `var(--bg-main)` for pages, `var(--bg-card)` for cards/panels.
- Borders: `var(--border)` for neutral, `var(--border-purple)` for purple-accented.
- Text: `var(--text-primary)` for headings/body, `var(--text-secondary)` for supporting text, `var(--text-muted)` for hints.
- Accent: `var(--accent)` for primary buttons and active states, `var(--accent-pale)` for soft backgrounds, `var(--accent-soft)` for hover states.
- Do not introduce dark mode variants — this app is light-only.

## Data & State
- All data is dummy/static — no real API calls, no fetch, no database.
- Keep mock data as plain JS arrays/objects defined at the top of the page file.
- Use `useState` for all interactive state (phase transitions, form inputs, history tracking).
- Do not install state management libraries (Redux, Zustand, etc.).

## Navigation
- Use `<Link href="...">` from `next/link` for all internal navigation.
- Use `usePathname()` from `next/navigation` for active state detection.
- Never use `<a href="...">` for internal routes.

## Dependencies
- Do not install new npm packages without explicit user approval.
- The project already has: Next.js 16, React 19, Tailwind CSS v4, Biome.
- Do not install ESLint, Prettier, or any other formatter — Biome handles both lint and format.

## Code Quality
- Run `npm run lint` (Biome) after writing new files.
- No `console.log` left in committed code.
- No unused imports.
- Always handle empty/zero states in lists (show a placeholder message, not a blank area).
- Buttons that trigger async operations must have a loading state.
- All interactive elements need an `aria-label` if they contain only an icon.

## Git
- Never commit directly to `main`.
- Branch names: `feature/<description>`, `fix/<description>`, `chore/<description>`.
- Commit messages: imperative mood, max 72 chars. Example: `Add AI interview feedback panel`.
- Stage specific files — never `git add .` or `git add -A`.
<!-- END:skyschool-agent-rules -->
