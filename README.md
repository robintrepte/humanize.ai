# HumanizeAI - AI Text Humanizer

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.9+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

HumanizeAI is a Next.js application that helps users transform AI-generated text into more natural, human-like writing. It features user authentication, saving texts, and credit-based usage.

## Features

- AI text humanization with multiple complexity levels
- Multi-language support
- User authentication (Email, Google)
- Credit-based system
- User profile management
- Admin dashboard
- Dark/Light mode support

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth:** Auth.js (NextAuth) v5 — JWT, Google OAuth, magic-link email
- **Database:** PostgreSQL with Drizzle ORM (migrations + schema)
- **Payments:** Mollie (subscriptions, webhooks)
- **AI:** OpenAI and Anthropic (configurable provider/model)
- **UI:** React 19, Tailwind CSS 4, Radix UI, Framer Motion

## License

ISC © [Robin Trepte](https://github.com/robintrepte). See [LICENSE](LICENSE) for details.
## Production checklist

- Use Node.js 20.9+ and set strong secrets (`AUTH_SECRET` ≥ 32 chars).
- Require `MOLLIE_WEBHOOK_SECRET` whenever Mollie is enabled.
- Run `npm run build` before deploy; the landing page falls back to static pricing if the database is unavailable at build time.
- Prefer host-level / Redis rate limiting for multi-instance production traffic.
