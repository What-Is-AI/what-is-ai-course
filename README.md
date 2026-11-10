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

**Lessons** (`messages/` and lesson media under `public/lesson2/`, `public/lesson3/`, `public/lessons/`): [CC BY-NC-SA 4.0](./LICENSE-CONTENT)

The lessons are a separate work loaded by the code as data. Third-party packages keep their own licenses. See [NOTICE](./NOTICE).

### Credit

If you use the lessons, include:

> Based on What Is AI? by Pro AI Assistant, with contributions from Malaga AI (https://whatisai.proaiassistant.com/), CC BY-NC-SA 4.0.

State if you made changes.

The **Pro AI Assistant** name and logo are not licensed, except for giving this credit.

For paid or commercial use, contact [info@proaiassistant.com](mailto:info@proaiassistant.com).
