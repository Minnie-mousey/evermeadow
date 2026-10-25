# Evermeadow Study 🌷

A cozy farm-themed Bible study and virtual-companion app starter. Built for GitHub Codespaces with React, Vite, Express, and an optional OpenAI-powered study helper.

## What is included
- Responsive farm-inspired dashboard and navigation
- KJV Bible reader interface with book/chapter navigation
- Public KJV service integration (requires internet and needs production validation)
- Sample passages available for John 1, Psalm 23, and Philippians 4
- Verse selection, highlights, bookmarks, verse/chapter notes
- Personal reflection journal stored in browser local storage
- Study timer, configurable daily goal, and companion growth
- Eight animal companions, three visual growth stages, unlock progression, and accessory selection
- Reading plan cards and progress markers
- AI study assistant backend endpoint, protected by server-side API key
- Original, editable SVG companion illustrations in `public/assets/pets/`
- GitHub Codespaces devcontainer setup

## Run in GitHub Codespaces
1. Create a new GitHub repository and upload the contents of this folder to the repository root.
2. Open **Code → Codespaces → Create codespace**.
3. In the terminal run:
   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```
4. Open the forwarded port **5173**.

The API runs on port **8787**. The app can be explored without an AI key, but AI responses require a valid OpenAI API key.

## Enable the study assistant
Add your key to `.env`:
```env
OPENAI_API_KEY=your_private_key
OPENAI_MODEL=gpt-4.1-mini
PORT=8787
```
Never commit `.env`, expose the key in browser code, or use a real key in screenshots. The provided `.gitignore` excludes `.env`.

## Important prototype limitations
This is a functional starter, not yet a production-ready published service.
- **Bible integration:** The app requests KJV chapters from the public getBible API. Public endpoints and formats can change, and service terms/attribution must be checked before release. Network/API failures are shown in the reader. The sample fallback is intentionally limited, not the full Bible.
- **Search:** Current search filters the currently loaded chapter, not the entire Bible. Build a full-text search index or use a properly licensed Bible provider before publication.
- **Persistence:** Notes, bookmarks, highlights, timer totals, journal, plan progress, and companion data are stored in the current browser's local storage. Clearing browser data deletes them. There are no user accounts, sync, or backup yet.
- **Timer:** The starter timer adds growth for each minute the timer is running. For production, add session validation, pause/resume handling, and robust date-based daily totals. The current daily total is a prototype value and does not yet reset automatically at midnight.
- **Pet art:** The UI currently uses emoji for in-app pets; original SVG art is included and ready to integrate into the component. This gives a simple editable asset pack, but the production app should use consistent, tested character illustrations and animations.
- **Reading plans:** Plans are starter templates. “Mark next day complete” is a prototype interaction, not yet linked to a validated reading schedule.
- **AI:** AI-generated interpretations can be wrong or incomplete. Make clear that answers are study assistance, distinguish text from interpretation, and encourage checking sources. Add rate limits, abuse controls, logging policy, and cost safeguards before deployment.
- **Other religious books / Bible translations:** Add each text only after confirming copyright, licence, attribution, edition, and tradition metadata. Do not assume a translation is public domain in every jurisdiction.
- **Accessibility/security:** Before launch, add automated tests, accessibility checks, secure account management, privacy policy, data export/deletion, rate limiting, and a production deployment configuration.

## Suggested next steps
1. Replace emoji rendering with the included SVGs and make animal illustrations consistent.
2. Integrate a full KJV dataset from a verified source or licensed API, with robust search and offline caching.
3. Add user accounts and cloud sync only after deciding on a backend/database.
4. Add automated tests for timer progression, evolution, passage navigation, and data persistence.
5. Build a PWA with offline chapter cache and optional reminders.
6. Add additional translations and religious texts with clearly labelled traditions and licensing.
7. Deploy the frontend and backend with environment secrets configured through the host, not committed files.

## Structure
```text
src/main.jsx               Main React application
src/styles.css             Theme and responsive UI
server/index.js            Express health and AI endpoints
public/assets/pets/        Original editable SVG pet illustrations
public/assets/accessories/ Accessory asset notes
.env.example               Safe environment variable template
.devcontainer/             Codespaces setup
```
