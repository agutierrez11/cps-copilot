# Career Booster AI - Implementation Plan

## Goal
Create an automated tool to bridge the gap between professional CVs and strategic job searching, specifically tailored for the user's profile and Fintech/LATAM market.

## Project Structure
The project will be located at `C:\Users\Antonio\.gemini\antigravity\scratch\CareerBoosterAI`.

### [Component] Web Interface [NEW]
- **Frontend**: React (Vite) + Tailwind CSS for a premium, responsive dashboard.
- **Backend**: Python (FastAPI) to serve the logic (CV analysis, scraping) to the frontend.
- **Hosting**: Locally hosted (`http://localhost:3000`), accessible via your browser.

### [Component] Project Structure [UPDATED]
- `/backend`:
    - `main.py`: API Server.
    - `cv_analyzer.py`: CV parsing logic.
    - `job_radar.py`: Scraper logic.
- `/frontend`:
    - React Dashboard with "CV Vault", "Job Radar", and "Optimizer" views.
    - **[NEW] Job Input Section**: A dedicated area to paste Job Descriptions (JD).

### [Component] The "Best of Both" Logic
- **From Enhancv (Optimization Engine)**:
    - **Input**: You paste the Job Description.
    - **Process**: The AI analyzes the JD for keywords and ATS requirements.
    - **Output**: It **automatically rewrites** your CV bullets and re-orders sections to match *that specific job*.
- **From JobLeads (Strategic Matching)**: We will implement high-level matching based on seniority, Fintech vertical, and specific market data (Mexico/LATAM).

## Verification Plan

### Automated Steps
- **Backend**: Run `cv_analyzer.py` logic tests.
- **Frontend**: Verify local server launch and UI responsiveness.
- **Integration**: Upload a CV via the UI and see the parsed JSON response.

## Next Steps
1.  Initialize `README.md` to document the project.
2.  Verify access to the source CVs in `C:\Users\Antonio\OneDrive\Escritorio\CVs_2026`.
3.  Create the skeleton for `cv_analyzer.py` and test PDF extraction.
