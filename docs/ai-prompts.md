## 🧠 AI Prompt Strategy

### 🧾 Purpose

The prompt strategy guides how the system communicates with the AI to:

* Extract structured information from uploaded résumés
* Tailor user experience to match a job description
* Highlight most relevant skills, metrics, and phrasing

### 🧩 Prompt Types

#### 1. **Résumé Parsing Prompt**

Used to extract experiences from uploaded text:

```txt
You are an assistant that extracts work experience data from résumé text.
Return the output as a JSON array of objects with fields:
  - job_title
  - company
  - start_date (YYYY-MM)
  - end_date (YYYY-MM or null)
  - description (single string)
  - skills (array of strings)

Résumé text:
"{FULL_RESUME_TEXT}""
```

#### 2. **Job Matching Prompt**

Used to rewrite content toward a job description:

```txt
You are a professional résumé editor. Match this candidate’s experience to the job description below.
Rewrite the résumé to emphasize relevant experience, metrics, and technologies.
Return sections in Markdown:
- Professional Summary
- Work Experience
- Skills

Candidate data:
{EXPERIENCE_JSON}

Job description:
"""
{JOB_DESCRIPTION_TEXT}
"""
```

### 🎛 Prompt Configuration Tips

* Use `temperature: 0.3` for consistency
* Use `max_tokens` around 1500–3000 depending on verbosity
* Consider retry mechanism for malformed output (JSON validation)
