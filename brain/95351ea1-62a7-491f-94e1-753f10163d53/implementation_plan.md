### [NEW FEATURE] CV Upload & Management
- **Goal**: Allow users to upload their own PDF resumes so the app uses *their* profile for matching, not just yours.
- **Frontend**: Add a "Upload CV" button and drag-and-drop zone in `CVVault.jsx`.
- **Backend**: New `POST /cvs/upload` endpoint to save files and trigger a re-scan.

### [NEW FEATURE] Universal URL Scraper
- **Goal**: Allow users to paste any job URL (LinkedIn, Jooble, specific company boards) to analyze it.
- **Frontend**: Search bar in `JobRadar.jsx` specifically for URLs.
- **Backend**: Use `BeautifulSoup` to extract job data from arbitrary HTML.

## Proposed Changes

### Backend
#### [NEW] [url_fetcher.py](file:///c:/Users/Antonio/.gemini/antigravity/scratch/CareerBoosterAI/backend/url_fetcher.py)
- Web scraping logic for arbitrary job portals.

#### [MODIFY] [main.py](file:///c:/Users/Antonio/.gemini/antigravity/scratch/CareerBoosterAI/backend/main.py)
- Endpoint for CV uploads.
- Endpoint for scraping custom job URLs.

### Frontend
#### [MODIFY] [CVVault.jsx](file:///c:/Users/Antonio/.gemini/antigravity/scratch/CareerBoosterAI/frontend/src/pages/CVVault.jsx)
- File upload UI and success/error states.

#### [MODIFY] [JobRadar.jsx](file:///c:/Users/Antonio/.gemini/antigravity/scratch/CareerBoosterAI/frontend/src/pages/JobRadar.jsx)
- URL input and integration with results list.

## Verification Plan

### Manual Verification
1. Open the Job Radar page.
2. Paste a public job portal URL (e.g., a specific search on Indeed or a Career page).
3. Verify that the app "scrapes" the page and lists the relevant vacancies found.
4. Select one of those vacancies and run the "Analyze & Optimize" flow.
