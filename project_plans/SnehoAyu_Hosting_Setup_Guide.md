  
**SnehoAyu**

*স্নেহ আয়ু*

**Complete Hosting & Infrastructure Setup Guide**

First-time setup — Every step, every click, every config value

Version 1.0  |  June 2025  |  For Developer Use

**Stack: Vercel (Frontend) \+ Railway (Backend) \+ Neon (Database) \+ Cloudflare R2 (Media) \+ MSG91 (SMS)**

# **Overview — What You Are Setting Up**

This guide walks you through setting up every service SnehoAyu needs — from zero to a fully running app. Follow the steps in order. Do not skip ahead.

| Service | What It Does | Cost | Setup Time |
| :---- | :---- | :---- | :---- |
| Vercel | Hosts the React PWA frontend. Auto-deploys from GitHub. | Free forever | 10 min |
| Railway | Hosts the Node.js backend API. Always-on server. | \~$5/month | 15 min |
| Neon | PostgreSQL database. Stores all patient and research data. | Free tier | 10 min |
| Cloudflare R2 | Stores all media files — videos, audio, images. | Free up to 10GB | 15 min |
| MSG91 | Sends OTP SMS and daily care tip SMS to mothers. | \~₹0.15 per SMS | 20 min |
| GitHub | Stores all code. Connects to Vercel and Railway for auto-deploy. | Free | 5 min |
| TOTAL | Complete infrastructure for 200 users | \~₹500–700/month | \~75 min |

Read this entire page before starting. The order matters. Set up GitHub first, then Neon, then Railway, then Vercel, then R2, then MSG91. Some steps give you values you need in later steps — keep a notepad open.

  **STEP 0    GitHub — Set Up Your Code Repository**

GitHub stores your code and connects to Vercel and Railway so they auto-deploy every time you push changes. You only set this up once.

### **0.1 — Create a GitHub Account**

1. Go to https://github.com

2. Click 'Sign up' — use your personal or work email

3. Choose the Free plan

4. Verify your email

### **0.2 — Create the Repository**

5. After login, click the '+' icon top right → 'New repository'

6. Repository name: snehoayu

7. Set to Private (important — medical project)

8. Tick 'Add a README file'

9. Click 'Create repository'

### **0.3 — Set Up Your Project Folder Structure**

Your repository should have this structure before you connect to any hosting service:

snehoayu/  
├── frontend/          ← React PWA (this is what Vercel hosts)  
│   ├── src/  
│   ├── public/  
│   ├── package.json  
│   └── vite.config.ts  
├── backend/           ← Node.js API (this is what Railway hosts)  
│   ├── src/  
│   ├── prisma/  
│   ├── package.json  
│   └── .env.example   ← template of all env variables (no real values)  
├── .gitignore  
└── README.md

### **0.4 — The .gitignore File (Very Important)**

Create a .gitignore file in the root. This stops secret keys from being accidentally uploaded to GitHub.

\# Environment files — NEVER commit these  
.env  
.env.local  
.env.production

\# Dependencies  
node\_modules/

\# Build outputs  
dist/  
build/  
.next/

\# OS files  
.DS\_Store  
Thumbs.db

RULE: Never put real API keys, passwords, or database URLs in your code files. They always go in .env files which are in .gitignore. If you accidentally commit a secret key, rotate it immediately.

  **STEP 1    Neon — Set Up the PostgreSQL Database**

Neon is your database. All patient records, research data, user accounts, checklist entries — everything lives here. Set this up first because Railway (backend) needs the database URL.

### **1.1 — Create a Neon Account**

10. Go to https://neon.tech

11. Click 'Sign Up' → sign up with your GitHub account (easiest)

12. You will land on the Neon dashboard

### **1.2 — Create a New Project**

13. Click 'New Project'

14. Project name: snehoayu

15. Database name: snehoayu\_db

16. Region: AWS ap-south-1 (Mumbai) — closest to West Bengal, lowest latency

17. PostgreSQL version: 16 (latest — keep default)

18. Click 'Create Project'

### **1.3 — Save Your Connection String**

After creating the project, Neon shows you a connection string. This is the most important value in your entire setup. Save it immediately.

\# Neon will show you something like this:  
postgresql://snehoayu\_user:AbCdEfGh1234@ep-cool-rain-123456.ap-south-1.aws.neon.tech/snehoayu\_db?sslmode=require

\# This is your DATABASE\_URL  
\# Save it in your notepad RIGHT NOW — you need it in Step 2

### **1.4 — Create Two Database Branches**

Neon has a branching feature. Use it to keep development and production data completely separate.

19. In your Neon project, click 'Branches' in the left sidebar

20. You already have a 'main' branch — this will be your PRODUCTION database

21. Click 'New Branch'

22. Name: develop

23. Parent: main

24. Click 'Create Branch'

25. Copy the connection string for the develop branch too — save it as DATABASE\_URL\_DEV

Production database URL → used in Railway production environment  
Development database URL → used on your local machine and Railway staging  
NEVER use the production database for testing. Always test on develop branch.

### **1.5 — Enable Connection Pooling**

26. In your Neon project, click 'Connection Pooling' in left sidebar

27. Enable pooling for the main branch

28. Mode: Transaction (recommended for REST APIs)

29. Copy the pooled connection string — it looks like the same URL but with '-pooler' in the hostname

30. Use this POOLED URL as your DATABASE\_URL in Railway — it handles many concurrent connections better

### **1.6 — Verify the Connection (Test it now)**

On your local machine, open terminal and run:

\# Install psql if you don't have it:  
\# Mac: brew install postgresql  
\# Windows: download from postgresql.org

\# Test connection (paste your connection string):  
psql 'postgresql://snehoayu\_user:PASSWORD@HOST/snehoayu\_db?sslmode=require'

\# You should see:  
\# snehoayu\_db=\>  
\# Type \\q to exit

  **STEP 2    Railway — Host the Node.js Backend**

Railway runs your backend API server. It is always on — unlike free Render which goes to sleep. It connects to your GitHub repo and deploys automatically every time you push code.

### **2.1 — Create a Railway Account**

31. Go to https://railway.app

32. Click 'Login' → 'Login with GitHub'

33. Authorise Railway to access your GitHub account

34. You land on the Railway dashboard

### **2.2 — Create a New Project**

35. Click 'New Project'

36. Select 'Deploy from GitHub repo'

37. Find and select your snehoayu repository

38. Railway asks which folder to deploy — type: backend

39. Click 'Deploy Now'

Railway will try to deploy and probably fail — that's fine. We need to add environment variables first.

### **2.3 — Add Environment Variables**

This is the most important step. Click on your service in Railway → click 'Variables' tab → add each variable below one by one.

| Variable Name | Value / Where to Get It | Notes |
| :---- | :---- | :---- |
| DATABASE\_URL | Paste the POOLED connection string from Neon Step 1.5 | Must be the pooled URL |
| JWT\_ACCESS\_SECRET | Generate: run  openssl rand \-base64 32  in terminal | Random 32-char string. Keep secret. |
| ACCESS\_TOKEN\_EXPIRES\_IN | 24h | Access token lifetime |
| REFRESH\_TOKEN\_EXPIRES\_IN\_DAYS | 30 | Refresh token lifetime in days. **Must be a positive integer** (like 30, not 30d) |
| PORT | 3000 | Railway uses this port |
| NODE\_ENV | production |  |
| CORS\_ORIGINS | https://snehoayu.vercel.app | Comma-separated list of allowed frontend origins (no trailing slash). Update after Vercel setup in Step 4 |
| MSG91\_AUTH\_KEY | Get from MSG91 dashboard — Step 5 | Fill in after Step 5 |
| MSG91\_SENDER\_ID | SNHAYU  (6 chars, your choice) | Shown as SMS sender name |
| MSG91\_TEMPLATE\_OTP | Get from MSG91 dashboard — Step 5 | OTP message template ID |
| R2\_ACCOUNT\_ID | Get from Cloudflare dashboard — Step 3 | Fill in after Step 3 |
| R2\_ACCESS\_KEY\_ID | Get from Cloudflare dashboard — Step 3 | Fill in after Step 3 |
| R2\_SECRET\_ACCESS\_KEY | Get from Cloudflare dashboard — Step 3 | Fill in after Step 3 |
| R2\_BUCKET\_NAME | snehoayu-media | The bucket you create in Step 3 |
| R2\_PUBLIC\_URL | https://media.snehoayu.com  (or your R2 public URL) | Fill in after Step 3 |
| BCRYPT\_PASSWORD\_ROUNDS | 12 | Password hashing strength (must be at least 12) |

### **2.4 — Set the Start Command**

40. In Railway, click your service → 'Settings' tab

41. Under 'Deploy', find 'Start Command'

42. Enter: node dist/index.js

43. Under 'Build Command' enter: npm run build

### **2.5 — Add a Custom Domain (Optional but Recommended)**

44. In Railway, click your service → 'Settings' → 'Domains'

45. Click 'Generate Domain' — Railway gives you a free URL like snehoayu-backend.up.railway.app

46. Save this URL — it is your BACKEND\_URL that the frontend will call

### **2.6 — Trigger First Deploy**

47. Go to your service → 'Deployments' tab

48. Click 'Deploy' or push any code change to GitHub

49. Watch the build logs — look for 'Server running on port 3000'

50. If it fails, check the logs — usually a missing environment variable

How to check if backend is working: open your Railway URL in browser and add /health to the end. Example: https://snehoayu-backend.up.railway.app/health — you should see: { status: 'ok', timestamp: '...' }

  **STEP 3    Cloudflare R2 — Media File Storage**

R2 stores all media files — audio messages, educational videos, learning hub images. Free up to 10GB. For SnehoAyu you will use roughly 600MB total.

### **3.1 — Create a Cloudflare Account**

51. Go to https://cloudflare.com

52. Click 'Sign Up' — use your email

53. Verify your email

54. You land on the Cloudflare dashboard

55. In the left sidebar, scroll down and click 'R2 Object Storage'

56. You may need to add a payment method — required for R2 even on free tier (they will not charge you unless you exceed 10GB)

### **3.2 — Create Your Bucket**

57. Click 'Create bucket'

58. Bucket name: snehoayu-media

59. Location: Automatic (Cloudflare chooses closest to your users)

60. Click 'Create bucket'

### **3.3 — Create the Folder Structure**

Inside the bucket, create these folders by uploading a placeholder file in each path:

snehoayu-media/  
├── audio/          ← weekly audio messages (.mp3 files)  
├── videos/         ← learning hub videos (.mp4 files)  
│   ├── feeding/  
│   ├── kmc/  
│   ├── danger-signs/  
│   └── emotional-support/  
├── images/         ← thumbnails and learning hub images (.webp files)  
└── backups/        ← automated database dumps (.sql.gz files)

### **3.4 — Make the Media Bucket Public**

61. Click on your snehoayu-media bucket

62. Click 'Settings' tab

63. Scroll to 'Public Access'

64. Click 'Allow Access' — this lets the app load images/audio/video without authentication

65. Cloudflare gives you a public URL like: https://pub-abc123.r2.dev

66. Save this URL — it is your R2\_PUBLIC\_URL

Only the media bucket is public. If you create a backups bucket later, keep it PRIVATE. Database dumps contain research data and must never be public.

### **3.5 — Create API Credentials**

67. In Cloudflare dashboard, click 'R2' in left sidebar

68. Click 'Manage R2 API Tokens' (top right)

69. Click 'Create API Token'

70. Token name: snehoayu-backend

71. Permissions: Object Read & Write

72. Specify bucket: snehoayu-media

73. Click 'Create API Token'

74. Cloudflare shows you THREE values — copy all three NOW (shown only once):

| Value | Where to Use It | Railway Variable Name |
| :---- | :---- | :---- |
| Account ID | Also shown on R2 dashboard main page | R2\_ACCOUNT\_ID |
| Access Key ID | Looks like a long random string | R2\_ACCESS\_KEY\_ID |
| Secret Access Key | Shown only once — copy immediately | R2\_SECRET\_ACCESS\_KEY |

75. Go back to Railway → Variables → update R2\_ACCOUNT\_ID, R2\_ACCESS\_KEY\_ID, R2\_SECRET\_ACCESS\_KEY with these values

76. Also update R2\_PUBLIC\_URL with the public URL from step 3.4

### **3.6 — Set Up a Custom Domain for Media (Optional but Cleaner)**

Instead of pub-abc123.r2.dev you can use media.snehoayu.com if you own a domain.

77. In Cloudflare, click your bucket → Settings → Custom Domains

78. Click 'Connect Domain'

79. Enter: media.snehoayu.com

80. Cloudflare handles the DNS automatically if your domain is on Cloudflare

81. Update R2\_PUBLIC\_URL in Railway to https://media.snehoayu.com

  **STEP 4    Vercel — Host the React PWA Frontend**

Vercel hosts your React frontend. It auto-deploys every time you push to GitHub. It gives you HTTPS automatically — required for PWA to work. Free forever for this scale.

### **4.1 — Create a Vercel Account**

82. Go to https://vercel.com

83. Click 'Sign Up' → 'Continue with GitHub'

84. Authorise Vercel to access your GitHub

85. You land on the Vercel dashboard

### **4.2 — Import Your Project**

86. Click 'Add New' → 'Project'

87. Find your snehoayu GitHub repository → click 'Import'

88. Vercel asks you to configure the project:

| Setting | Value |
| :---- | :---- |
| Framework Preset | Vite |
| Root Directory | frontend   (click Edit and type frontend) |
| Build Command | npm run build |
| Output Directory | dist |
| Install Command | npm install |

### **4.3 — Add Environment Variables in Vercel**

Before clicking Deploy, scroll down to 'Environment Variables' and add:

| Variable Name | Value | Notes |
| :---- | :---- | :---- |
| VITE\_API\_BASE\_URL | https://snehoayu-backend.up.railway.app/api | Your Railway backend URL from Step 2.5 **with /api appended at the end** |

All frontend environment variables MUST start with VITE\_ in a Vite/React project. Variables without VITE\_ are invisible to the browser for security.

### **4.4 — Deploy**

89. Click 'Deploy'

90. Watch the build logs — should complete in 60–90 seconds

91. Vercel gives you a URL like: https://snehoayu.vercel.app

92. Open it in your phone browser — you should see the SnehoAyu app

### **4.5 — Update Railway CORS with Vercel URL**

93. Go back to Railway → Variables

94. Update CORS\_ORIGIN to: https://snehoayu.vercel.app

95. Redeploy Railway (or it auto-deploys on variable change)

### **4.6 — Set Up PWA Manifest**

For the app to be installable on Android phones, your frontend needs a manifest.json. Create this file at frontend/public/manifest.json:

{  
  "name": "SnehoAyu — Preterm Care",  
  "short\_name": "SnehoAyu",  
  "description": "আপনার শিশুর যত্নের সঙ্গী",  
  "start\_url": "/",  
  "display": "standalone",  
  "background\_color": "\#EBF8FF",  
  "theme\_color": "\#2B6CB0",  
  "orientation": "portrait",  
  "icons": \[  
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },  
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }  
  \]  
}

### **4.7 — Add Custom Domain (Optional)**

96. In Vercel, go to your project → Settings → Domains

97. Click 'Add Domain'

98. Enter: snehoayu.in or www.snehoayu.com

99. Vercel gives you DNS records to add at your domain registrar

100. After DNS propagates (up to 24 hours), your app is live at your custom domain

  **STEP 5    MSG91 — SMS Gateway for OTP and Daily Messages**

MSG91 sends two types of SMS for SnehoAyu: (1) OTP messages during login and signup, and (2) daily care tip messages to mothers. Best SMS provider for India — reliable OTP delivery even on BSNL and Jio.

### **5.1 — Create a MSG91 Account**

101. Go to https://msg91.com

102. Click 'Sign Up' → enter your details

103. Verify your phone number and email

104. You land on the MSG91 dashboard

### **5.2 — Complete KYC**

MSG91 requires KYC (Know Your Customer) before you can send SMS to Indian numbers. This takes 1–2 working days.

105. Click 'Account' → 'KYC Verification'

106. Upload: PAN card \+ Aadhaar card (or company registration if business account)

107. Submit and wait for approval email

108. You cannot send OTP SMS until KYC is approved — plan for this delay

### **5.3 — Create an OTP Template**

Indian regulations require all SMS content to be pre-approved as templates. You cannot send free-form SMS.

109. In MSG91 dashboard, click 'SMS' → 'Templates'

110. Click 'Add Template'

111. Template Type: OTP

112. Sender ID: SNHAYU

113. Template content (exact text):

\#\#OTP\#\# is your SnehoAyu login code. Valid for 10 minutes.  
Do not share this code with anyone. \- SnehoAyu Team

114. Submit for DLT approval (explained below in 5.4)

### **5.4 — DLT Registration (Important — India Specific)**

DLT stands for Distributed Ledger Technology. TRAI (India's telecom regulator) requires ALL commercial SMS senders to register on a DLT platform. Without this, your SMS will be blocked.  
This is a one-time registration. Takes 3–7 working days. Do this in parallel with development.

115. Go to https://www.airtel.in/business/sms-solutions — or Jio DLT or Vodafone DLT (any one is fine)

116. Register as an 'Entity' (you are the business/organization sending SMS)

117. Submit: PAN, Aadhaar, and a brief description of your SMS use case ('Healthcare app OTP for mothers of preterm infants — West Bengal research study')

118. After approval, you get an Entity ID and Header (sender ID) approval

119. Register your OTP template on the DLT platform — get a Template ID

120. Enter the DLT Entity ID and Template ID in MSG91 dashboard under your template

### **5.5 — Get Your API Key**

121. In MSG91 dashboard, click your profile icon → 'API'

122. Copy the Auth Key — it looks like: 123456TsomethingXXXXXX

123. Go to Railway → Variables → update MSG91\_AUTH\_KEY with this value

124. Update MSG91\_TEMPLATE\_OTP with the Template ID from 5.4

### **5.6 — Add Promotional Credits for Daily SMS**

Daily care tips are 'promotional' or 'transactional' SMS depending on DLT category. For a research study, register them as transactional. Add credits:

125. In MSG91, click 'Recharge'

126. Add ₹500 credit to start — this gives you \~3,300 SMS

127. For 136 mothers × 180 days \= 24,480 SMS total — add ₹3,700 more over the study period

128. Or add credits month by month — about ₹700/month during the study

  **STEP 6    Local Development Setup — Your Computer**

Set up your local machine to run SnehoAyu in development mode. You need Node.js and a few tools.

### **6.1 — Install Required Tools**

| Tool | How to Install | Version Needed |
| :---- | :---- | :---- |
| Node.js | Download from nodejs.org — choose LTS version | 18 or 20 LTS |
| npm | Comes with Node.js automatically | 9+ |
| Git | Download from git-scm.com | Any recent |
| VS Code | Download from code.visualstudio.com — recommended editor | Any |
| psql | Mac: brew install postgresql  |  Windows: download postgresql.org | Any |
| Postman | Download from postman.com — for testing APIs | Any |

### **6.2 — Clone the Repository**

\# Open terminal / command prompt  
cd Documents   \# or wherever you keep projects

\# Clone your repo (replace YOUR\_USERNAME)  
git clone https://github.com/YOUR\_USERNAME/snehoayu.git

\# Enter the project  
cd snehoayu

### **6.3 — Backend Local Setup**

\# Go into backend folder  
cd backend

\# Install all dependencies  
npm install

\# Create your local .env file  
cp .env.example .env

\# Open .env in VS Code and fill in the values:  
code .env

### **6.4 — The Backend .env File (Local)**

Open backend/.env and fill in every value. Here is the complete template:

\# ── DATABASE ─────────────────────────────────────────  
DATABASE\_URL=postgresql://USER:PASS@HOST/snehoayu\_db?sslmode=require  
\# Paste your Neon DEVELOP branch connection string here (not production)

\# ── AUTH ─────────────────────────────────────────────  
JWT\_SECRET=paste\_your\_random\_32\_char\_string\_here  
JWT\_REFRESH\_SECRET=paste\_different\_random\_32\_char\_string  
JWT\_EXPIRES\_IN=24h  
JWT\_REFRESH\_EXPIRES\_IN=30d  
BCRYPT\_ROUNDS=12

\# ── SERVER ───────────────────────────────────────────  
PORT=3000  
NODE\_ENV=development  
CORS\_ORIGIN=http://localhost:5173

\# ── SMS (MSG91) ──────────────────────────────────────  
MSG91\_AUTH\_KEY=your\_msg91\_auth\_key\_here  
MSG91\_SENDER\_ID=SNHAYU  
MSG91\_TEMPLATE\_OTP=your\_dlt\_template\_id\_here

\# ── CLOUDFLARE R2 ────────────────────────────────────  
R2\_ACCOUNT\_ID=your\_cloudflare\_account\_id  
R2\_ACCESS\_KEY\_ID=your\_r2\_access\_key\_id  
R2\_SECRET\_ACCESS\_KEY=your\_r2\_secret\_key  
R2\_BUCKET\_NAME=snehoayu-media  
R2\_PUBLIC\_URL=https://pub-abc123.r2.dev

### **6.5 — Set Up the Database (Run Migrations)**

\# Still inside backend/ folder

\# Run Prisma migrations — creates all tables in your Neon database  
npx prisma migrate dev \--name init

\# You should see:  
\# ✓ Generated Prisma Client  
\# ✓ Applied migration: 20250601\_init

\# View your database visually (optional but very helpful)  
npx prisma studio  
\# Opens a browser at localhost:5555 — shows all your tables

### **6.6 — Start the Backend**

\# Inside backend/ folder  
npm run dev

\# You should see:  
\# Server running on port 3000  
\# Database connected successfully

\# Test it — open a new terminal and run:  
curl http://localhost:3000/health

\# Expected response:  
\# {"status":"ok","timestamp":"2025-06-01T10:00:00.000Z"}

### **6.7 — Frontend Local Setup**

\# Open a NEW terminal window  
\# Go back to project root  
cd snehoayu/frontend

\# Install dependencies  
npm install

\# Create frontend .env file  
cp .env.example .env.local

\# Fill in the values:  
code .env.local

### **6.8 — The Frontend .env.local File**

\# Frontend environment variables — must start with VITE\_

VITE\_API\_URL=http://localhost:3000  
\# Points to your LOCAL backend while developing  
\# Change to Railway URL when deploying

VITE\_APP\_NAME=SnehoAyu  
VITE\_R2\_PUBLIC\_URL=https://pub-abc123.r2.dev  
VITE\_APP\_ENV=development

### **6.9 — Start the Frontend**

\# Inside frontend/ folder  
npm run dev

\# You should see:  
\# VITE v5.x.x  ready in 300ms  
\# ➜  Local:   http://localhost:5173

\# Open http://localhost:5173 in your browser  
\# You should see the SnehoAyu app running locally

  **STEP 7    Auto-Deploy — Push Code, Everything Updates**

Once everything is connected, this is your daily workflow. You write code locally, push to GitHub, and both Vercel and Railway automatically update.

### **7.1 — The Git Workflow**

\# After making changes to your code:

\# 1\. See what changed  
git status

\# 2\. Stage your changes  
git add .

\# 3\. Commit with a message  
git commit \-m "Add OTP verification screen"

\# 4\. Push to GitHub  
git push origin main

\# What happens automatically after push:  
\# → Vercel sees the push → rebuilds frontend → live in \~60 seconds  
\# → Railway sees the push → rebuilds backend → live in \~90 seconds

### **7.2 — Use Branches for Safety**

\# Don't always push directly to main  
\# Use a feature branch for new work:

\# Create and switch to a new branch  
git checkout \-b feature/otp-login

\# Do your work, commit changes  
git add .  
git commit \-m "Implement OTP login flow"

\# Push the branch  
git push origin feature/otp-login

\# On GitHub, create a Pull Request to merge into main  
\# Review the code, then merge  
\# Vercel and Railway auto-deploy after merge to main

  **STEP 8    Automated Backups — Protect Research Data**

For a formal research study, losing data is catastrophic. Set up backups BEFORE you start collecting participant data. This step is not optional.

### **8.1 — Neon Automatic Backup (Already Working)**

Neon automatically keeps 7 days of point-in-time recovery on the free tier. No setup needed. If something goes wrong, you can restore to any minute in the last 7 days from the Neon dashboard.

### **8.2 — Weekly Automated Database Dump**

Create a cron job in Railway that runs every Sunday at 2 AM IST and dumps the database to R2.

Create this file in your backend: backend/src/jobs/weeklyBackup.ts

import { exec } from 'child\_process';  
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';  
import { createReadStream } from 'fs';

// Runs every Sunday at 2 AM IST (20:30 UTC Saturday)  
// Add to your cron scheduler: '30 20 \* \* 0'

export async function runWeeklyBackup() {  
  const date \= new Date().toISOString().split('T')\[0\];  
  const filename \= \`backup-${date}.sql.gz\`;

  // 1\. Dump the database  
  exec(\`pg\_dump ${process.env.DATABASE\_URL} | gzip \> /tmp/${filename}\`,  
    async (err) \=\> {  
      if (err) { console.error('Backup failed:', err); return; }

      // 2\. Upload to R2  
      const client \= new S3Client({  
        region: 'auto',  
        endpoint: \`https://${process.env.R2\_ACCOUNT\_ID}.r2.cloudflarestorage.com\`,  
        credentials: {  
          accessKeyId: process.env.R2\_ACCESS\_KEY\_ID\!,  
          secretAccessKey: process.env.R2\_SECRET\_ACCESS\_KEY\!,  
        },  
      });

      await client.send(new PutObjectCommand({  
        Bucket: process.env.R2\_BUCKET\_NAME,  
        Key: \`backups/${filename}\`,  
        Body: createReadStream(\`/tmp/${filename}\`),  
      }));

      console.log(\`Backup uploaded: backups/${filename}\`);  
    }  
  );  
}

### **8.3 — Manual Backup at Each Research Milestone**

At baseline, 1 month, 3 months, and 6 months — Dr. Ponnarasi downloads the Excel export from the researcher panel and saves it in two places: her laptop and a USB drive. This is the final safety net that does not depend on any cloud service.

  **STEP 9    Final Verification Checklist**

Before starting participant enrolment, verify every item below. Tick each one physically.

### **GitHub**

* Repository created and set to Private

* .gitignore is working — no .env files are visible on GitHub

* Both frontend and backend folders are committed

### **Neon Database**

* Project created in ap-south-1 (Mumbai) region

* Two branches exist: main (production) and develop

* Connection pooling enabled on main branch

* All database tables created (run: npx prisma studio and verify all tables exist)

* Test write and read one row to verify connection

### **Railway Backend**

* Service deployed and showing green status

* All 17 environment variables are set

* https://your-backend.up.railway.app/health returns { status: 'ok' }

* CORS\_ORIGIN matches your Vercel URL exactly

### **Vercel Frontend**

* Project deployed and showing green status

* https://snehoayu.vercel.app opens in mobile browser

* VITE\_API\_URL is set to Railway backend URL

* PWA manifest.json is present — app can be installed on Android

* Test: open on Android phone → browser shows 'Add to Home Screen' prompt

### **Cloudflare R2**

* Bucket snehoayu-media created

* Folder structure created (audio/, videos/, images/, backups/)

* Public access enabled — test by uploading a test image and opening its public URL

* API credentials saved in Railway environment variables

* Backups folder is working — test the weekly backup script manually

### **MSG91**

* Account created and KYC approved

* DLT entity registration approved

* OTP template created and DLT-approved

* API key saved in Railway environment variables

* Test OTP: call POST /auth/send-otp with a real Indian phone number and verify SMS is received

### **End-to-End Test**

* A test mother account can be created — full signup flow works

* OTP is received on a real phone

* PIN can be set and used to log back in

* Home dashboard loads with correct language (Bengali)

* Upload a test audio file to R2 and play it from the app

# **Monthly Cost Summary**

| Service | Free Tier Limit | Your Usage (200 users) | Monthly Cost |
| :---- | :---- | :---- | :---- |
| Vercel | 100GB bandwidth, unlimited deploys | \~2GB bandwidth | ₹0 |
| Railway | No free tier — $5/month minimum | $5/month (\~₹420) | ₹420 |
| Neon | 512MB storage, 10 compute hours/day | \~15MB storage, \<1 hour/day | ₹0 |
| Cloudflare R2 | 10GB storage, 1M reads/month | \~600MB storage, \~10,000 reads | ₹0 |
| MSG91 OTP | Pay per SMS at ₹0.15–0.25 | \~200 OTPs total (one-time signups) | \~₹30 total |
| MSG91 Daily SMS | Pay per SMS at ₹0.15 | 136 mothers × 180 days \= 24,480 SMS | \~₹600/month |
| GitHub | Unlimited private repos | 1 repo | ₹0 |
| TOTAL |  |  | \~₹1,020/month |

Total cost for the 6-month study period: approximately ₹6,000–7,000 all inclusive.  
This is well within the ₹1 lakh development budget.  
The biggest cost is MSG91 daily SMS. If budget is tight, the daily tip can be shown only in-app (no SMS) which brings cost to ₹420/month.

# **Master List — All Environment Variables**

Keep this page with you during setup. Every variable that needs to be set, where to set it, and where to get the value.

## **Backend Variables — Set in Railway**

| Variable | Where to Get It | Example Value |
| :---- | :---- | :---- |
| DATABASE\_URL | Neon dashboard → Connection String (pooled) | postgresql://user:pass@host/db?sslmode=require |
| JWT\_ACCESS\_SECRET | Generate: openssl rand \-base64 32 | Kx9mP2qR7vN4wL8eA1bC6dF3gH5jM0n |
| ACCESS\_TOKEN\_EXPIRES\_IN | Hardcode | 24h |
| REFRESH\_TOKEN\_EXPIRES\_IN\_DAYS | Hardcode | 30 |
| PORT | Hardcode | 3000 |
| NODE\_ENV | Hardcode | production |
| CORS\_ORIGINS | Vercel project URL | https://snehoayu.vercel.app |
| BCRYPT\_PASSWORD\_ROUNDS | Hardcode | 12 |
| MSG91\_AUTH\_KEY | MSG91 dashboard → API section | 123456TxxxxXXXXXXXXX |
| MSG91\_SENDER\_ID | Your DLT-approved sender ID | SNHAYU |
| MSG91\_TEMPLATE\_OTP | MSG91 dashboard → Templates → OTP template ID | 1234567890123456789 |
| R2\_ACCOUNT\_ID | Cloudflare dashboard → R2 main page | abc123def456 |
| R2\_ACCESS\_KEY\_ID | Cloudflare → R2 API Tokens | abc123... |
| R2\_SECRET\_ACCESS\_KEY | Cloudflare → R2 API Tokens (shown once) | xyz789... |
| R2\_BUCKET\_NAME | Hardcode | snehoayu-media |
| R2\_PUBLIC\_URL | Cloudflare → your bucket → public URL | https://pub-abc.r2.dev |

## **Frontend Variables — Set in Vercel**

| Variable | Where to Get It | Example Value |
| :---- | :---- | :---- |
| VITE\_API\_BASE\_URL | Railway → your service → domain URL | https://snehoayu-backend.up.railway.app/api |

## **Local Development Only — backend/.env**

| Variable | Value for Local Dev |
| :---- | :---- |
| DATABASE\_URL | Neon DEVELOP branch connection string (not production) |
| NODE\_ENV | development |
| CORS\_ORIGINS | http://localhost:5173 |
| PORT | 3000 |
| All others | Same values as Railway — copy from your Railway variables |

*SnehoAyu Hosting Setup Guide  |  v1.0  |  June 2025  |  Keep this document secure — contains architecture details*