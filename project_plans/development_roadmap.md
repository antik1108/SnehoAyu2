# SnehoAyu: 4-Week Phased Development Roadmap & Prompt Matrix

This roadmap breaks down the complete development of **SnehoAyu** (mHealth PWA) into **25 structured steps (one prompt per day)**. Each step is designed to be fed sequentially into your AI coding assistant (Copilot, Codex, or Antigravity) to write clean, industry-grade, error-free TypeScript code.

---

## 📅 Week 1: Backend Foundation & Authentication
Focus: Recreating database connections, auth routes, and onboarding APIs in TypeScript.

### Day 1: Server Infrastructure & Middleware
*   **Goal**: Establish the Express application skeleton, request middlewares, and database health check routes.
*   **Prompt**:
    ```text
    Set up the core infrastructure for the SnehoAyu TypeScript Express backend.
    
    1. In `backend/src/index.ts`, create the primary server script listening on port 4000.
    2. Add standard middlewares:
       - Express JSON parser with limit settings
       - CORS setup (allowing origin configurations)
       - Request logging middleware
       - Global exception and error handling middleware
    3. Import the generated PrismaClient from '../generated/prisma/index.js' and initialize it.
    4. Implement an endpoint `GET /api/health` that runs a query (`SELECT 1`) to verify the database connection.
    
    Write all code in clean, modular TypeScript using modern ESM imports (always end local imports with `.js` extensions). Write clean, production-grade code with error catches.
    ```

### Day 2: OTP Generation & Verification
*   **Goal**: Setup SMS gateway mock schemas and implement `POST /auth/send-otp` and `/auth/verify-otp`.
*   **Prompt**:
    ```text
    Implement the OTP authentication routes in the SnehoAyu TypeScript backend.
    
    1. Create route and controller files for authentication: `src/routes/authRoutes.ts` and `src/controllers/authController.ts`.
    2. Implement `POST /api/auth/send-otp`:
       - Accept a 10-digit phone number. Validate the phone matches India format (adds +91 automatically).
       - Check if the phone is already registered in `User`.
       - Generate a 6-digit numeric OTP.
       - Hash the OTP using SHA-256 and store it in the `OtpVerification` table with purpose = 'signup', attempts = 0, and expiresAt = 10 minutes in the future.
       - Mock the SMS gateway call (log the generated OTP to console for local testing).
    3. Implement `POST /api/auth/verify-otp`:
       - Accept phone and 6-digit OTP.
       - Query active `OtpVerification` records.
       - Increment attempts on check. If attempts >= 3, reject and lock.
       - Verify hash and expiry. If valid, mark the verification record as used (`isUsed: true`, `usedAt: now`).
       - Return a short-lived token (`signup_token` valid for 15 minutes containing the phone number) for subsequent PIN creation.
    
    Write all code using TypeScript and Prisma.
    ```

### Day 3: PIN Registration & Returning User Login
*   **Goal**: Create bcrypt hash handlers for 4-digit PIN configuration and JWT authentication.
*   **Prompt**:
    ```text
    Implement the secure PIN registration and login API endpoints in the SnehoAyu backend.
    
    1. Implement `POST /api/auth/create-pin`:
       - Accept `signup_token` and a 4-digit PIN.
       - Validate the signup token is valid.
       - Verify that no active user already exists with this phone.
       - Hash the PIN using bcrypt (10 rounds).
       - Create a new `User` record: `phone` = token phone, `pinHash` = bcrypt hash, `role` = 'mother', `preferredLanguage` = 'bn'.
       - Return success response.
    2. Implement `POST /api/auth/login`:
       - Accept phone number and 4-digit PIN.
       - Fetch the user. If user is locked (`lockedUntil` in the future), reject.
       - Compare hashes. If incorrect, increment `failedPinAttempts`. If attempts reach 5, set `lockedUntil` for 30 minutes and return lock warning.
       - If correct, reset `failedPinAttempts` to 0. Generate a JWT access token (expires in 24 hours) and a SHA-256 hashed refresh token (stored in `RefreshToken` table, expires in 30 days).
       - Return access token, refresh token, and user profile metadata (id, role, preferredLanguage).
    
    Implement this securely in TypeScript.
    ```

### Day 4: Mother & Infant Profiles Insertion
*   **Goal**: Implement onboarding endpoints `/onboarding/mother-profile` and `/onboarding/baby-profile`.
*   **Prompt**:
    ```text
    Implement the profile storage APIs for onboarding in the SnehoAyu backend.
    
    1. Create a middleware `requireAuth` in `src/middlewares/authMiddleware.ts` that validates the JWT access token and appends `user` payload to the request.
    2. Implement `POST /api/onboarding/mother-profile`:
       - Requires authentication.
       - Accept form data: `fullName` (optional), `ageRange`, `educationMother`, `educationFather`, `occupationMother`, `occupationFather`, `incomeClass`, `familyType`, `familyMembersCount`, `religion`, `residenceType`, `contactNumber`, `prevPretermEducation`, `educationSource`.
       - Create/upsert a record in the `MotherProfile` table linked to the current `User` ID.
    3. Implement `POST /api/onboarding/baby-profile`:
       - Requires authentication.
       - Accept baby data: `babyName` (optional), `sex` (male/female), `dateOfBirth`, `gestationalAgeWeeks`, `birthWeightGrams`, `weightAtDischargeGrams`, `placeOfDelivery`, `nicuStayDays`, `skinToSkinAtBirth`, `kmcInNicu`, `feedingAtDischarge`, `criedAtBirth`, `neededResuscitation`, `dischargeDate`.
       - Automatically calculate the `birthWeightStratum` based on `birthWeightGrams`:
         - Under 1500g -> 'under_1500'
         - 1500g to 2500g -> '1500_to_2500'
         - Over 2500g -> 'over_2500'
       - Store the baby record in the `BabyProfile` table linked to the mother profile.
    
    Write all code in TypeScript.
    ```

### Day 5: Hospital Code & Participant Code Generation
*   **Goal**: Link hospital codes and auto-generate unique participant IDs (`BNK-S-042`).
*   **Prompt**:
    ```text
    Implement the Hospital verification and Participant Code allocation APIs in the backend.
    
    1. Create a migration or seed script to insert default hospitals with code, name, and emergency numbers (e.g. Code 'BNK' for Bankura Medical College, 'BWN' for Burdwan Medical College).
    2. Implement `POST /api/onboarding/hospital-code`:
       - Requires authentication.
       - Accept a hospital code (e.g., "BNK"). Verify it exists in the `Hospital` table.
       - Link the `User` and `MotherProfile` records to the verified hospital.
    3. Implement `GET /api/onboarding/participant-code`:
       - Requires authentication.
       - Fetch the linked hospital code (e.g., 'BNK').
       - Retrieve the study group assignment (Study 'S' or Control 'C') configured for the mother. (For now, let the system randomly assign S or C with 50/50 probability, but allow manual override).
       - Count the existing participants at this hospital to get the next sequential number.
       - Format the participant code as: `[HospitalPrefix]-[GroupPrefix]-[SequentialNumber]` (e.g. `BNK-S-042`).
       - Save this participant code to the `MotherProfile` and return it.
    
    Implement this in TypeScript.
    ```

---

## 📅 Week 2: Onboarding Flow (Frontend) & Home Dashboard
Focus: Creating translation-friendly client forms and the parent portal.

### Day 6: Onboarding Completion & Baseline Follow-ups
*   **Goal**: Implement completion finalize endpoint `/onboarding/complete` which auto-schedules the 4 follow-up dates.
*   **Prompt**:
    ```text
    Implement the onboarding finalization logic in the backend.
    
    1. Implement `POST /api/onboarding/complete`:
       - Requires authentication.
       - Mark onboarding as finalized.
       - Read the baby's `dischargeDate`.
       - Automatically create 4 follow-up records in the `FollowUpSchedule` table for this mother:
         - Baseline: scheduledDate = dischargeDate
         - 1 Month: scheduledDate = dischargeDate + 30 days
         - 3 Months: scheduledDate = dischargeDate + 90 days
         - 6 Months: scheduledDate = dischargeDate + 180 days
       - Set status to 'pending' and dataComplete = false.
    2. Add validation triggers to verify all preceding profiles (mother, baby, hospital) are fully populated before permitting onboarding finalization.
    
    Write this in TypeScript.
    ```

### Day 7: Frontend Routing & Auth Context Setup
*   **Goal**: Create type-safe React Router links, Language Select, and Auth Context.
*   **Prompt**:
    ```text
    Setup the frontend navigation system and authentication context in TypeScript.
    
    1. In `frontend/src/context/AuthContext.tsx`, write a context provider:
       - Manage user token, active user profile interface, and loading states.
       - Set up methods: `login(phone, pin)`, `signupStep1(phone)`, `verifyOtp(otp)`, `registerPin(pin)`, and `logout()`.
       - Read initial values from localStorage.
    2. Set up Axios API client helper `src/utils/api.ts` with interceptors to automatically attach the Bearer token and handle 401 token refresh triggers.
    3. Build `frontend/src/pages/LanguageSelect.tsx` with Bengali-first buttons. Save choices to localStorage and trigger `i18n.changeLanguage()`.
    
    Write all code in React + TypeScript.
    ```

### Day 8: Onboarding Frontend - Welcome & Phone Entry
*   **Goal**: Create UI screens for language redirection, welcome highlight cards, and phone validation.
*   **Prompt**:
    ```text
    Create the frontend Welcome and Phone Signup screens in TypeScript.
    
    1. Configure route guards in `src/routes/AppRoutes.tsx`:
       - Redirect to `/language-select` if no language is selected.
       - Redirect to `/welcome` if first launch.
       - Redirect to `/dashboard` if logged in.
    2. Build `frontend/src/pages/Welcome.tsx` featuring the 3 core highlight cards (Daily Care, Growth, Danger Signs) and action buttons: "Create Account" and "I Already Have an Account".
    3. Build `frontend/src/pages/SignupPhone.tsx`:
       - Handle 10-digit number validation.
       - Make API call `POST /auth/send-otp`.
       - Render inline error messages in the selected locale if verification fails.
    
    Adhere to the SnehoAyu Design System (rounded corners, solid teal/rose primary accents, clean borders).
    ```

### Day 9: Onboarding Frontend - OTP & PIN Forms
*   **Goal**: Implement the 6-digit OTP passcode inputs and 4-dot PIN creation fields.
*   **Prompt**:
    ```text
    Create the frontend OTP Verification and PIN Creation screens.
    
    1. Build `frontend/src/pages/OtpVerification.tsx`:
       - Renders a 6-digit input structure where focus auto-advances as the user types.
       - Displays a countdown timer ("Resend in 02:30").
       - Displays option to trigger re-send OTP after 3 minutes.
    2. Build `frontend/src/pages/CreatePin.tsx`:
       - Renders 4 masked dot inputs using a large, touch-forgiving virtual numeric keypad.
       - Prompt user to "Confirm your PIN" by repeating the digits.
       - Ensure errors trigger clear messages in Bengali/Hindi/English locales.
    
    Maintain mobile-first layouts (360px-480px width focus).
    ```

### Day 10: Onboarding Frontend - Profiles & Finalize
*   **Goal**: Implement the multi-step Mother Profile, Baby Profile, Hospital Verification, and Completion screens.
*   **Prompt**:
    ```text
    Implement the frontend profile forms for the onboarding flow.
    
    1. Build `frontend/src/pages/MotherProfileForm.tsx`:
       - Multi-choice dropdown select boxes matching Mother Info fields (age range, education levels, etc.).
       - Implement validation to ensure all P0 mandatory fields are filled.
    2. Build `frontend/src/pages/BabyProfileForm.tsx`:
       - Fields matching baby’s clinical records (birth weight, gestational age, discharge date).
       - Enforce date validation (cannot select future dates).
    3. Build `frontend/src/pages/HospitalCodeEntry.tsx` to verify hospital codes (e.g. 'BNK').
    4. Build `frontend/src/pages/SignupComplete.tsx` displaying the generated Participant Code, Hospital, and Study Group in a clean card with a "Go to Home" button.
    
    Implement this in React + TypeScript.
    ```

---

## 📅 Week 3: Dashboard, Daily checklist, & Research Forms
Focus: Launching the primary checklist portal and data collection forms.

### Day 11: Home Dashboard Layout
*   **Goal**: Wired up the Mother's landing portal with a circular progress ring and vital logs.
*   **Prompt**:
    ```text
    Build the main Home Dashboard screen for mothers.
    
    1. Create `frontend/src/pages/Dashboard.tsx` with a mobile-first bottom navigation layout.
    2. Implement the following dashboard components:
       - Baby Status Card: Display baby name, chronological age (days/weeks), adjusted age (corrected weeks), and latest recorded weight.
       - Today's Care Ring: A circular SVG progress ring displaying the percentage of today's care checklist completed.
       - Quick Action Row: Flat rounded buttons for "Log Feeding", "Log Temperature", "Log KMC".
       - Health Stats Strip: Showing the last logged temperature and weight.
       - Daily Message Card: Displaying the daily care tip in the selected language.
    3. Fetch and display data from the backend APIs.
    
    Implement this in React + TypeScript.
    ```

### Day 12: Daily Care Checklist
*   **Goal**: Create the daily checklist grid with persistence, resetting automatically at midnight.
*   **Prompt**:
    ```text
    Implement the Daily Care Checklist feature in both backend and frontend.
    
    1. Create backend model schema and routes for `DailyLog`:
       - Track log entries for: Breastfeeding feeds/volume, KMC hours, Temperature (morning/evening), Weight check, Skin/cord care, and Danger sign checks.
       - Keep one database row per participant per day.
       - Create an endpoint `GET /api/checklist/today` and `POST /api/checklist/log` to update progress.
    2. Build the frontend Checklist page (`src/pages/Checklist.tsx`):
       - Render checklist items with large checkbox targets.
       - Reset completion states locally when the device crosses midnight local time.
       - Wire checkbox ticks to backend update endpoints.
    
    Write all code in TypeScript.
    ```

### Day 13: Research Form - Knowledge MCQ
*   **Goal**: Build the 15-question multiple-choice questionnaire with strict scoring logic.
*   **Prompt**:
    ```text
    Implement the 15-question Knowledge Assessment (Tool III) in the backend and frontend.
    
    1. Create backend schemas and routes for `KnowledgeAssessment`:
       - Store assessment score, time point ('baseline', '1_month', etc.), and individual question responses.
       - Implement scoring logic: 1 point per correct answer. Total out of 15.
       - Expose `POST /api/assessments/knowledge` to submit results. Lock submissions once submitted for a given timepoint.
    2. Build frontend screen `src/pages/assessments/KnowledgeMCQ.tsx`:
       - Display questions sequentially (one at a time) in the user's selected language.
       - Block navigation back once submitted.
       - Render large, tap-forgiving answer options.
    
    Use the question-answer matrix from Page 20 of the PRD.
    ```

### Day 14: Research Forms - Mental Well-Being (WHO-5) & Self-Efficacy (PSOC)
*   **Goal**: Implement the 5-item WHO-5 and 17-item PSOC questionnaires with reverse scoring calculations.
*   **Prompt**:
    ```text
    Implement the WHO-5 Index (Tool IV) and PSOC Scale (Tool V) assessments in both backend and frontend.
    
    1. Backend:
       - Create endpoints to save submissions for WHO-5 and PSOC.
       - WHO-5 calculation: Raw score (sum of 0-5 scales, range 0-25) and percentage score (raw * 4). Flag if raw score < 13.
       - PSOC calculation: 6-point Likert scale (1-6). Auto-reverse score items 2, 3, 4, 5, 8, 9, 12, 14, 16 (score becomes 7 - selected_value). Sum into subscales: Efficacy and Satisfaction.
    2. Frontend:
       - Create screen `src/pages/assessments/Who5Assessment.tsx` with 6-point radio buttons and descriptive Bengali labels.
       - Create screen `src/pages/assessments/PsocAssessment.tsx` for the 17 self-efficacy questions.
    
    Write clean, type-safe TypeScript code.
    ```

### Day 15: Growth Tracking (Calculations & Form)
*   **Goal**: Build the growth log form and backend Corrected Age engine.
*   **Prompt**:
    ```text
    Implement the Growth Tracking database APIs and manual entry forms.
    
    1. Backend:
       - Implement `POST /api/growth/log` to record weight (grams), length (cm), and head circumference (cm).
       - Create a calculation helper `utils/age.ts` to compute:
         - Chronological Age: `today - dateOfBirth` in days/weeks.
         - Corrected Age: `chronological_age - (40 - gestational_age_weeks)` in weeks. This must automatically adjust for baby's prematurity.
    2. Frontend:
       - Create a manual growth entry form `src/pages/growth/AddReading.tsx` with input validation (e.g. weight must be between 400g and 5000g).
       - Build a growth history list component displaying past entries with chronological and corrected age details.
    
    Write in TypeScript.
    ```

---

## 📅 Week 4: Charts, PWA configuration, & Admin Panel
Focus: Implementing data visualizations, offline operations, and researcher export dashboard.

### Day 16: Growth Charts Rendering
*   **Goal**: Render growth metrics line charts comparing baby weight against WHO percentile bands.
*   **Prompt**:
    ```text
    Implement the WHO Growth Chart rendering component in the frontend using Recharts or Chart.js.
    
    1. Create a dataset containing WHO percentile curve benchmarks (3rd, 15th, 50th, 85th, 97th percentiles) for weight-for-age, length-for-age, and head-circumference-for-age, separated by infant sex (boys vs girls) for 0 to 6 months.
    2. Build `src/components/growth/GrowthChart.tsx`:
       - Plot baby's historical entries against the WHO percentile bands based on the baby's Corrected Age.
       - Provide toggle buttons to switch between weight, length, and head circumference views.
       - Add alert flags if the latest recorded Z-score falls below -2 SD.
    
    Build this cleanly using React + TypeScript.
    ```

### Day 17: TDSC Milestones screen
*   **Goal**: Build the 18-item Trivandrum Developmental Screening Chart pass/fail questionnaire.
*   **Prompt**:
    ```text
    Implement the TDSC Developmental Milestone Tracker (Tool II B2).
    
    1. Backend:
       - Create schema to record pass/fail results for the 18 TDSC tasks.
       - Implement calculation logic: Filter developmental tasks based on baby's Corrected Age. If any task is marked "Fail" where the upper age limit is less than the baby's corrected age, flag as 'Suspected Delay'.
    2. Frontend:
       - Build `src/pages/assessments/TdscTracker.tsx` with a checklist of age-appropriate milestones.
       - Display clear icons with checkmark (Pass) / cross (Fail) triggers.
    
    Use the 18 developmental tasks and upper/lower bounds specified on Page 17 of the PRD.
    ```

### Day 18: Immunization Tracker
*   **Goal**: Generate the customized vaccine schedule from chronological birth date.
*   **Prompt**:
    ```text
    Implement the Immunization Schedule & Tracker.
    
    1. Backend:
       - Create database schema to store vaccine records with due dates, completed dates, batch numbers, and administrator names.
       - Implement schedule generator: Calculate vaccine due dates from Chronological Birth Date (not corrected age) using standard IAP 2023 guidelines (Birth, 6 weeks, 10 weeks, 14 weeks, etc.).
    2. Frontend:
       - Build `src/pages/ImmunizationTracker.tsx` displaying:
         - Progress bar representing percentage of vaccination schedule completed.
         - Tabbed lists for "Pending Vaccines" and "Completed Vaccines".
         - Detailed info modal explaining vaccine purpose and common side effects.
    
    Write in TypeScript.
    ```

### Day 19: Danger Signs Guide
*   **Goal**: Create the emergency symptom card accordion and one-tap hospital call trigger.
*   **Prompt**:
    ```text
    Build the Danger Signs Guide and Emergency Support screen.
    
    1. Create `src/pages/DangerSigns.tsx` containing expandable cards for the 10 danger signs listed on Page 19 of the PRD.
    2. Structure each symptom card with:
       - Accompanying warning illustration or icon
       - "What to Observe" (in Bengali/Hindi/English)
       - "What to Do" (actionable steps)
    3. Include a prominent, floating red emergency call button:
       - Clicking requires confirmation to avoid accidental triggers.
       - Upon confirmation, trigger a telephone link `tel:` dialing the hospital's pre-configured NICU helpline.
    
    Follow the "Soft Precision" visual direction.
    ```

### Day 20: Learning Hub & Audio Player
*   **Goal**: Build the JSON-based CMS content deck and persistent audio playback widgets.
*   **Prompt**:
    ```text
    Implement the Learning Hub and Audio Player.
    
    1. Create a JSON-based content repository file in the frontend containing articles and audio metadata on care categories (Feeding, KMC, Growth, Danger Signs).
    2. Build `src/pages/LearningHub.tsx` displaying search tags, cards for articles, and featured cards.
    3. Implement a custom audio player component `src/components/AudioPlayer.tsx`:
       - Handles audio playback (play, pause, seek, speed controls) for weekly care audio tips.
       - Track user completion metric ("Read/viewed" status) and report to the backend.
    
    Write this in React + TypeScript.
    ```

### Day 21: Daily SMS & Weekly Audio Backend Scheduler
*   **Goal**: Setup node-cron jobs to process scheduled tips and cache audio resources.
*   **Prompt**:
    ```text
    Implement the backend scheduler for daily text and weekly audio care tips.
    
    1. Create a database model `CareMessage` storing 180 daily text messages in Bengali.
    2. Setup a cron utility using `node-cron` or `pg-boss` running daily at midnight IST:
       - Fetch participants who are currently active (within their 6-month post-discharge timeline).
       - Select the daily care tip matching the participant's current study week.
       - Mock sending the SMS (log details to terminal or file system).
    3. Expose backend endpoint `/api/messages/history` allowing the mother to review past SMS texts in-app.
    
    Write this in TypeScript.
    ```

### Day 22: Telehealth Video Launcher
*   **Goal**: Create video call metadata tables and deep link redirect interfaces.
*   **Prompt**:
    ```text
    Implement the Telehealth Video Call launch integrations.
    
    1. Create backend table `VideoCallSession` storing call dates, timestamps, session duration, and participant code.
    2. Implement endpoint `POST /api/telehealth/session` allowing researchers to log sessions.
    3. Build `src/pages/TelehealthCall.tsx` on the frontend:
       - When a call is active, display a notification card on the home dashboard.
       - Generate deep links allowing the user to initiate or join a call (using Option C: WhatsApp call redirection or Jitsi Meet link integration).
    
    Write clean, type-safe TypeScript code.
    ```

### Day 23: Researcher Admin Panel (Data Export)
*   **Goal**: Build the admin dashboard for participant stratification, monitoring, and SPSS Excel exports.
*   **Prompt**:
    ```text
    Implement the Researcher Admin Panel and Excel Data Export APIs.
    
    1. Build endpoints for researchers:
       - `GET /api/admin/participants`: Fetch enrolled mothers with status, active study group, and hospital identifiers.
       - `GET /api/admin/participants/:id`: Detailed view compiling growth, TDSC milestones, checklist compliance, and questionnaire results.
    2. Implement a data export utility using `exceljs` or `xlsx`:
       - `GET /api/admin/export`: Export an SPSS-compatible Excel file containing participant baseline demographics, calculated z-scores, raw test scores, and compliance ratios.
       - Support an "Anonymize" flag replacing names with participant codes for researcher blinding.
    
    Write in TypeScript.
    ```

### Day 24: Progressive Web App Caching & Service Worker
*   **Goal**: Configure Workbox custom caching strategies, offline checklists, and index.html manifest triggers.
*   **Prompt**:
    ```text
    Configure PWA capabilities for offline-first support in Vite + React + TypeScript.
    
    1. Install `vite-plugin-pwa` in the frontend.
    2. Configure `vite.config.ts` to generate `manifest.json`:
       - Set primary brand colors: background `#f8fafc`, theme `#0f766e`.
       - Add high-contrast application icons for mobile splash screens.
    3. Implement custom service worker rules using Workbox:
       - Cache static page routing, icons, and translation files.
       - Cache checklist state and log submissions to IndexedDB for synchronization using Background Sync once connection is restored.
    
    Verify that the app passes Lighthouse PWA audits.
    ```

### Day 25: Theme variables & Bengali font overrides
*   **Goal**: Run a CSS review ensuring HSL tokens swap cleanly in dark/light mode and Hind Siliguri overrides are responsive.
*   **Prompt**:
    ```text
    Perform a comprehensive UI/UX refinement audit for Bengali typography and dark-mode compliance.
    
    1. Verify that all typography blocks use the "Hind Siliguri" font-family, applying line-height spacing (minimum 1.6) to avoid vertical overlap of Bengali script characters.
    2. Check the CSS variable variables in `index.css`:
       - Ensure theme switches cleanly between light and dark modes.
       - Double-check that contrast ratios satisfy WCAG 2.1 AA targets (minimum 4.5:1).
    3. Ensure all interactive target regions (buttons, check targets, nav links) exceed 48x48px for easy one-handed accessibility.
    
    Run build commands to verify both workspace compilation packages compile cleanly without warnings.
    ```
