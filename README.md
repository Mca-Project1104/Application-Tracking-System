# ATS — Applicant Tracking System

A full-stack ATS platform that connects **Candidates, Recruiters/Companies, and Admins** for managing the complete recruitment process.

## Core Features

### Candidate

* Registration & email verification
* Profile management
* Resume upload
* Resume analysis
* Job search
* Job application
* ATS score
* Application status tracking
* Real-time chat

### Recruiter / Company

* Company profile
* Job posting & management
* View applicants
* Resume analysis
* AI-based candidate ranking
* Skill matching
* Candidate shortlisting
* Hiring pipeline
* Interview management
* Recruiter notes
* Real-time chat

### Admin

* User management
* Company management
* Job management
* Platform monitoring
* Reports & analytics

## How It Works

```text
Candidate
   ↓
Register / Login
   ↓
Upload Resume
   ↓
Browse Job
   ↓
Apply
   ↓
Resume + Job Description
   ↓
Node.js / Express Backend
   ↓
FastAPI AI Service
   ↓
Groq LLM
   ↓
Resume Analysis
   ↓
ATS Match Score
   ↓
Matched Skills + Missing Skills
   ↓
Save Application & Score
   ↓
Recruiter Dashboard
   ↓
Candidate Ranking
   ↓
Shortlist → Interview → Offer → Hired
```

## ATS Ranking

The AI compares the candidate's resume with the selected job description and generates:

* Match Score
* Matched Skills
* Missing Skills
* Strengths
* Weaknesses
* Suggestions

## Technology Stack

* **Frontend:** React 18, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **AI:** FastAPI, Groq LLM, Llama 3.3 70B
* **Authentication:** JWT, Bcrypt
* **Real-time:** Socket.io
* **File Upload:** Multer
* **Email:** Nodemailer

## Main Workflow

```text
Candidate → Resume → Job Application
                         ↓
                    AI Analysis
                         ↓
                   ATS Score
                         ↓
                  Candidate Ranking
                         ↓
              Recruiter Hiring Pipeline
                         ↓
             Interview → Offer → Hired
```

## Project Goal

To automate resume screening and candidate ranking while providing companies with an organized hiring workflow and candidates with a simple job application and tracking experience.
