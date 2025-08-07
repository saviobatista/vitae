## 📄 Résumé Parser

### 🧭 Goal

Convert an unstructured résumé PDF into structured JSON data representing each job experience.

### 🧩 Key Output Format

```json
[
  {
    "job_title": "Software Engineer",
    "company": "TechCorp Inc",
    "start_date": "2020-01",
    "end_date": "2023-06",
    "description": "Developed scalable web applications using Next.js and Node.js.",
    "skills": ["Next.js", "Node.js", "TypeScript"]
  },
  ...
]
```

### 🛠 Parsing Strategy

- Use `pdf-lib` or `pdfjs-dist` to extract raw text from the uploaded file
- Apply block segmentation heuristics:
  - Detect headers, line spacing, bullet points
  - Identify known job-section patterns (e.g., Job Title @ Company)

- Sanitize and reflow multi-line content
- Use AI fallback when heuristics are insufficient (via résumé parsing prompt)

### 🔐 Privacy Considerations

- Avoid uploading the full résumé to AI unless opted-in
- Strip personal identifiers before processing (e.g., name, phone, email)

### 📂 Parser Module Structure

```
/lib/parser
  ├── extractText.ts     # Extracts raw text from PDF buffer
  ├── segmentBlocks.ts   # Separates text into logical blocks (experience, education)
  ├── normalize.ts       # Cleans and structures text
  └── toJson.ts          # Maps to JSON schema for AI
```
