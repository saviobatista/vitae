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
