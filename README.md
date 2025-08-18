# VITAE

[![CI](https://github.com/saviobatista/vitae/workflows/CI/badge.svg)](https://github.com/saviobatista/vitae/actions/workflows/ci.yml)
[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/saviobatista/vitae/graphs/commit-activity)
[![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue)](https://www.typescriptlang.org/)

**Transform your résumé. Tailor your future.**

**VITAE** is an open source, AI-powered résumé tailoring tool. Upload your CV, paste a job description, and let the system reshape your professional story to match the role — exporting a clean, focused résumé in LaTeX and PDF formats.

---

## ✨ Features

- 📄 Upload your résumé in PDF (support for other formats coming soon)
- 🧠 Automatically extract structured experience data using AI
- 📝 Paste any job description to receive a customized résumé tailored for it
- 📚 Generates LaTeX source and a downloadable PDF
- 🌐 Runs entirely in the browser (Next.js, deployed to Vercel or GitHub Pages)
- ⚙️ Plugin-ready: bring your own AI API (ChatGPT, Claude, etc.)

---

## 🧠 How It Works

1. **Upload** your résumé (PDF)
2. **Extract** work experiences and skills using an AI parser
3. **Paste** a job description you're applying for
4. **Generate** a custom résumé that emphasizes the most relevant qualifications
5. **Export** as a polished LaTeX-based PDF

---

## 🛠 Tech Stack

| Layer          | Tech Used                                          |
| -------------- | -------------------------------------------------- |
| Frontend       | Next.js (App Router)                               |
| AI Integration | OpenAI GPT (via API)                               |
| Parsing        | `pdf-lib`, `pdf-parse`                             |
| Output         | LaTeX → PDF (via serverless render or WebAssembly) |
| Hosting        | Vercel / GitHub Pages                              |
| Storage        | Supabase / file-based fallback (optional)          |

---

## 🚀 Getting Started

```bash
git clone https://github.com/saviobatista/vitae.git
cd vitae
pnpm install
pnpm dev
```

Create a `.env.local` file with your API keys:

```env
OPENAI_API_KEY=sk-...
```

---

## 🐳 Docker

This repo includes a production-ready multi-stage Dockerfile and a docker-compose setup for hot-reload development.

### Development (hot reload)

Requirements: Docker Desktop and Docker Compose.

1. Copy your env file:

   ```bash
   cp .env.example .env  # then edit values

   ```

2. Start the dev server with live reload:

   ```bash
   docker compose up web-dev
   ```

- The app runs at http://localhost:3000
- Source is bind-mounted; changes trigger instant reload (Turbopack)
- Container uses its own node_modules for consistency

### Production (standalone image)

Build and run the minimal runner image:

```bash
# Build the prod image
docker build --target runner -t vitae:latest .

# Run with runtime envs from .env
docker run --rm -p 3000:3000 --env-file .env vitae:latest
```

Or via Compose:

```bash
docker compose build web
docker compose up -d web
```

### Environment variables

- Secrets are NOT baked into the image. `.env` files are ignored by Docker context via `.dockerignore`.
- For runtime configuration, use `--env-file .env` (as in the examples) or `-e KEY=value`.
- For client-exposed variables (`NEXT_PUBLIC_*`) that must be inlined at build time, prefer setting explicit build args in the Dockerfile and pass them with `--build-arg`. Example snippet you can add if needed:

  ```dockerfile
  # in Dockerfile (builder stage)
  ARG NEXT_PUBLIC_ANALYTICS_ID
  ENV NEXT_PUBLIC_ANALYTICS_ID=$NEXT_PUBLIC_ANALYTICS_ID
  ```

  Then build with:

  ```bash
  docker build --target runner -t vitae:latest . \
    --build-arg NEXT_PUBLIC_ANALYTICS_ID=abc123
  ```

Notes:

- The Dockerfile uses multi-stage builds: `deps` → `builder` → `runner` for production, and a `dev` target for local hot reload.
- Next.js is built with `output: "standalone"` for a slim runtime image.

---

## 📦 Folder Structure (Planned)

```
/app
  /upload        → Resume upload & parsing
  /builder       → Job description input & AI tailoring
  /export        → LaTeX generation and PDF download
/lib
  /parser        → PDF to structured data
  /ai            → Prompt builders & API handlers
  /latex         → Templates and render helpers
/public
  /templates     → LaTeX templates
```

---

## 🧪 Roadmap

- [ ] PDF Upload
- [ ] Resume Parser
- [ ] Job Description Input
- [ ] AI Prompt Generator
- [ ] Tailored Experience Selector
- [ ] LaTeX PDF Renderer
- [ ] Template Customization
- [ ] Multiple Format Support (DOCX, TXT)
- [ ] Plugin Architecture

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss your idea.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: add my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a PR

---

## 🏛️ About the Name

**Vitae** is Latin for “life” — and the heart of _curriculum vitae_. This project brings your résumé to life: adaptive, tailored, and crafted for your next opportunity.

---

## 📜 License

This project is licensed under the [CC BY-NC 4.0 License](https://creativecommons.org/licenses/by-nc/4.0/).  
You may use, modify, and distribute the code for non-commercial purposes only.
