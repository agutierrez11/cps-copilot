# Career Booster AI - Implementation Plan

This tool is designed to be a "bridge" between professional CV building (Enhancv) and strategic job searching (JobLeads), but fully automated and personalized for your profile.

## User Review Required

> [!IMPORTANT]
> The tool will run as a standalone suite of Python scripts in a new directory: `C:\Users\Antonio\OneDrive\Escritorio\CareerBoosterAI`. It will NOT interfere with your existing project.

## Proposed Changes

### [Component] Project Structure [NEW]
- **`main.py`**: The central orchestrator.
- **`cv_analyzer.py`**: Extracts data from your PDFs.
- **`job_radar.py`**: Scrapes and filters job boards.
- **`optimizer.py`**: Per-job analysis, "Match Score" generation, and **Automatic CV Optimization** (Rewriting bullets and re-ordering sections for specific vacancies).

### [Component] CV Parser
- We will use `pdfminer` or `PyPDF2` to read your files.
- I will create a "Master Profile" JSON from your most recent CV.

### [Component] The "Best of Both" Logic
- **From Enhancv (Optimization Engine)**: We will implement an AI layer that takes your "Master CV" and, for a specific job, **automatically rewrites** the descriptions to use the exact terminology required by the ATS.
- **From JobLeads (Strategic Matching)**: We will implement high-level matching based on seniority, Fintech vertical, and specific market data (Mexico/LATAM).

## Verification Plan

### Automated Steps
- Run `cv_analyzer.py` and verify it correctly identifies your "Regional Sales Lead" experience.
- Run `job_radar.py` to ensure it fetches at least 5 relevant Fintech roles in Mexico/Remote.
- Generate a sample report for one vacancy.
