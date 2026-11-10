# What is AI?

Interactive AI literacy course. **Ask first, explain later** — learners probe what they think they know, try things out, then get short teaching moments.

**Live:** [https://whatisai.proaiassistant.com](https://whatisai.proaiassistant.com)

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No `.env` is required for lessons. Optional analytics / GA / admin vars are listed in [`.env.example`](./.env.example).

**Stack:** Next.js (App Router), Tailwind CSS, Framer Motion. Deploy target: Vercel.

## Design

Each lesson has its own dedicated visual theme — not a shared content shell.

## Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md).

- **Translations** — [docs/contributing/translations.md](./docs/contributing/translations.md)
- **New theoretical lessons** — [docs/contributing/lesson-principles.md](./docs/contributing/lesson-principles.md) (probe → interact → teach; you don’t need to copy existing lesson architecture)
- **Bugs / UX fixes** — open an issue, then a PR

Please don’t open PRs for operator-only analytics or admin tooling.

## License

**Code and interactive demos:** [AGPL-3.0-only](./LICENSE)

**Lessons:** [CC BY-NC-SA 4.0](./LICENSE-CONTENT) — covers `messages/`, `public/lesson2/`, `public/lesson3/`, `public/lessons/` (except `public/lessons/7/audio/`), `src/app/presentation2026malaga/what-is-ai-deck.html`, and lesson wording in `src/lib/lesson*-data.ts`.

**Third-party (own licenses):**
- Lesson 7 music (`public/lessons/7/audio/`): [Kevin MacLeod](https://incompetech.com), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) — see [public/lessons/7/CREDITS.md](./public/lessons/7/CREDITS.md)
- IBM VGA font (`public/fonts/`): [VileR](https://int10h.org/oldschool-pc-fonts/), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Other fonts in `src/fonts/`: see [src/fonts/README.md](./src/fonts/README.md) (mostly SIL OFL 1.1; Roboto Apache-2.0)
- npm packages keep their own licenses

Full notice: [NOTICE](./NOTICE).

### Credit

If you use the lessons, include:

> Based on What Is AI? by Pro AI Assistant, with contributions from Malaga AI (https://whatisai.proaiassistant.com/), CC BY-NC-SA 4.0.

State if you made changes.

The **Pro AI Assistant** name and logo are licensed only for this credit. The **Malaga AI** name and logo belong to Malaga AI and are not licensed.

For paid or commercial use, contact [info@proaiassistant.com](mailto:info@proaiassistant.com).
