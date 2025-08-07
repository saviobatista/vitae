## 🏗 Architecture

### 🧩 High-Level Diagram

```
User
 │
 ▼
[Upload PDF Page] ──▶ [PDF Parser] ──▶ [Structured Experience Data]
 │                                          │
 ▼                                          ▼
[Job Description Input] ───────▶ [AI Tailoring Engine]
                                             │
                                             ▼
                             [LaTeX Generator & PDF Export]
```

### 📦 Components

* **Frontend (Next.js)**

  * `/app/upload`: File upload UI and validation
  * `/app/builder`: Job description input and résumé tailoring
  * `/app/export`: LaTeX preview and download

* **PDF Parser**

  * Converts raw PDF to JSON-like experience format
  * Handles text layout and semantic block parsing

* **AI Tailoring Engine**

  * Sends structured experience + job description to LLM
  * Returns rewritten content emphasizing relevant traits

* **LaTeX Generator**

  * Selects or loads LaTeX template
  * Fills in dynamic fields (experience, education, summary)
  * Renders LaTeX as downloadable PDF